const { sendErrorResponse } = require("../helpers/send_error_response");
const Admin = require("../models/admin.model");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const config = require("config");
const {
  adminValidation,
  updateAdminValidation,
} = require("../validations/admin.validation");
const { AdminJwtService } = require("../services/jwt.service");
const { adminMailService } = require("../services/mail.service");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);

    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const { full_name, phone, email, birth_date, password, confirm_password } =
      value;

    const candidate = await Admin.findOne({ where: { email } });
    if (candidate) {
      return sendErrorResponse(
        { message: "This user already exists" },
        res,
        400
      );
    }

    if (password !== confirm_password) {
      return sendErrorResponse({ message: "Passwords didn't match" }, res, 400);
    }
    const hashed_password = await bcrypt.hash(password, 7);
    const activation_link = uuid.v4();
    const link = `${config.get(
      "api_url"
    )}/api/admins/activate/${activation_link}`;

    await adminMailService.sendMail(email, link);

    const newData = await Admin.create({
      full_name,
      phone,
      email,
      birth_date,
      hashed_password,
      is_active: false,
      activation_link,
    });

    const payload = {
      id: newData.id,
      email: newData.email,
      is_active: newData.is_active,
      role: "admin",
    };

    const tokens = AdminJwtService.generateTokens(payload);
    newData.hashed_token = await bcrypt.hash(tokens.refreshToken, 7);
    await newData.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("adminCookieRefreshTime"),
    });

    res.status(201).send({
      message: "New Admin Added. Check your email",
      admin: { id: newData.id, full_name, email },
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return sendErrorResponse({ message: "User not found" }, res, 404);
    }

    if (!admin.is_active) {
      return sendErrorResponse(
        { message: "Account is not activated" },
        res,
        403
      );
    }

    const isMatch = await bcrypt.compare(password, admin.hashed_password);
    if (!isMatch) {
      return sendErrorResponse({ message: "Incorrect password" }, res, 400);
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      is_active: admin.is_active,
      role: "admin",
    };

    const tokens = AdminJwtService.generateTokens(payload);
    admin.hashed_token = await bcrypt.hash(tokens.refreshToken, 7);
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("adminCookieRefreshTime"),
    });

    res.send({
      message: "Login successful",
      admin: { id: admin.id, full_name: admin.full_name, email },
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Refresh token not found in cookie" });
    }

    const admins = await Admin.findAll({
      where: { hashed_token: { [Op.ne]: null } },
    });

    let matchedAdmin = null;

    for (const admin of admins) {
      const isMatch = await bcrypt.compare(refreshToken, admin.hashed_token);
      if (isMatch) {
        matchedAdmin = admin;
        break;
      }
    }

    if (!matchedAdmin) {
      return res.status(400).send({ message: "Invalid refresh token" });
    }

    matchedAdmin.hashed_token = null;
    await matchedAdmin.save();

    res.clearCookie("refreshToken");

    return res.send({ message: "Successfully logged out" });
  } catch (error) {
    return sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await Admin.findAll();
    res.status(200).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const data = await Admin.findByPk(req.params.id);
    if (!data) {
      return sendErrorResponse({ message: "Admin not found" }, res, 404);
    }
    res.status(200).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = updateAdminValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    await admin.update(value);
    res.send({ message: "Admin updated", admin });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const data = await Admin.findByPk(req.params.id);
    if (!data) {
      return sendErrorResponse({ message: "Admin not found" }, res, 404);
    }

    await data.destroy();
    res.status(200).send({ message: "Admin deleted" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const activate = async (req, res) => {
  try {
    const { link } = req.params;

    const user = await Admin.findOne({ where: { activation_link: link } });

    if (!user) {
      return res.status(400).send({ message: "Activation link is invalid" });
    }

    if (user.is_active) {
      return res.status(400).send({ message: "Account is already activated" });
    }

    user.is_active = true;
    user.activation_link = null;
    await user.save();

    res.send({ message: "Account successfully activated" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const changePassword = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { old_password, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
      return res.status(400).send({ message: "Passwords do not match" });
    }

    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(old_password, admin.hashed_password);
    if (!isMatch) {
      return res.status(401).send({ message: "Old password is incorrect" });
    }

    admin.hashed_password = await bcrypt.hash(new_password, 7);
    await admin.save();

    res.status(200).send({ message: "Password successfully changed" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).send({ message: "Refresh token not found" });
    }

    const decodedPayload = await AdminJwtService.verifyRefreshToken(
      refreshToken
    );
    if (!decodedPayload) {
      return res.status(403).send({ message: "Invalid refresh token" });
    }

    const admin = await Admin.findByPk(decodedPayload.id);
    if (!admin || !admin.hashed_token) {
      return res.status(403).send({ message: "Access denied" });
    }

    const isMatch = await bcrypt.compare(refreshToken, admin.hashed_token);
    if (!isMatch) {
      return res.status(403).send({ message: "Refresh token doesn't match" });
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      is_active: admin.is_active,
      role: "admin",
    };
    const tokens = AdminJwtService.generateTokens(payload);

    admin.hashed_token = await bcrypt.hash(tokens.refreshToken, 7);
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("adminCookieRefreshTime"),
    });

    res.send({
      accessToken: tokens.accessToken,
      message: "Access token refreshed",
    });
  } catch (error) {
    return sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  create,
  login,
  logout,
  findAll,
  findOne,
  update,
  remove,
  activate,
  changePassword,
  refresh,
};
