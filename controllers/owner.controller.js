const { sendErrorResponse } = require("../helpers/send_error_response");
const Owner = require("../models/owner.model");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const config = require("config");
const {
  ownerValidation,
  updateOwnerValidation,
} = require("../validations/owner.validation");
const { OwnerJwtService } = require("../services/jwt.service");
const { ownerMailService } = require("../services/mail.service");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { error, value } = ownerValidation(req.body);

    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const { full_name, phone, email, password, confirm_password } = value;

    const candidate = await Owner.findOne({ where: { email } });
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
    )}/api/owners/activate/${activation_link}`;

    await ownerMailService.sendMail(email, link);

    const newData = await Owner.create({
      full_name,
      phone,
      email,
      hashed_password,
      is_active: false,
      activation_link,
    });

    const payload = {
      id: newData.id,
      email: newData.email,
      is_active: newData.is_active,
      role: "owner",
    };

    const tokens = OwnerJwtService.generateTokens(payload);
    newData.hashed_token = await bcrypt.hash(tokens.refreshToken, 7);
    await newData.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("ownerCookieRefreshTime"),
    });

    res.status(201).send({
      message: "New Owner Added. Check your email",
      owner: { id: newData.id, full_name, email },
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ where: { email } });
    if (!owner) {
      return sendErrorResponse({ message: "User not found" }, res, 404);
    }

    if (!owner.is_active) {
      return sendErrorResponse(
        { message: "Account is not activated" },
        res,
        403
      );
    }

    const isMatch = await bcrypt.compare(password, owner.hashed_password);
    if (!isMatch) {
      return sendErrorResponse({ message: "Incorrect password" }, res, 400);
    }

    const payload = {
      id: owner.id,
      email: owner.email,
      is_active: owner.is_active,
      role: "owner",
    };

    const tokens = OwnerJwtService.generateTokens(payload);
    owner.hashed_token = await bcrypt.hash(tokens.refreshToken, 7);
    await owner.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("ownerCookieRefreshTime"),
    });

    res.send({
      message: "Login successful",
      owner: { id: owner.id, full_name: owner.full_name, email },
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

    const owners = await Owner.findAll({
      where: { hashed_token: { [Op.ne]: null } },
    });

    let matchedOwner = null;

    for (const owner of owners) {
      const isMatch = await bcrypt.compare(refreshToken, owner.hashed_token);
      if (isMatch) {
        matchedOwner = owner;
        break;
      }
    }

    if (!matchedOwner) {
      return res.status(400).send({ message: "Invalid refresh token" });
    }

    matchedOwner.hashed_token = null;
    await matchedOwner.save();

    res.clearCookie("refreshToken");

    return res.send({ message: "Successfully logged out" });
  } catch (error) {
    return sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await Owner.findAll();
    res.status(200).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const data = await Owner.findByPk(req.params.id);
    if (!data) {
      return sendErrorResponse({ message: "Owner not found" }, res, 404);
    }
    res.status(200).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = updateOwnerValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const owner = await Owner.findByPk(req.params.id);
    if (!owner) {
      return res.status(404).send({ message: "Owner not found" });
    }

    await owner.update(value);
    res.send({ message: "Owner updated", owner });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const data = await Owner.findByPk(req.params.id);
    if (!data) {
      return sendErrorResponse({ message: "Owner not found" }, res, 404);
    }

    await data.destroy();
    res.status(200).send({ message: "Owner deleted" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const activate = async (req, res) => {
  try {
    const { link } = req.params;

    const user = await Owner.findOne({ where: { activation_link: link } });

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
    const ownerId = req.owner.id;
    const { old_password, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
      return res.status(400).send({ message: "Passwords do not match" });
    }

    const owner = await Owner.findByPk(ownerId);
    if (!owner) {
      return res.status(404).send({ message: "Owner not found" });
    }

    const isMatch = await bcrypt.compare(old_password, owner.hashed_password);
    if (!isMatch) {
      return res.status(401).send({ message: "Old password is incorrect" });
    }

    owner.hashed_password = await bcrypt.hash(new_password, 7);
    await owner.save();

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

    const decodedPayload = await OwnerJwtService.verifyRefreshToken(
      refreshToken
    );
    if (!decodedPayload) {
      return res.status(403).send({ message: "Invalid refresh token" });
    }

    const owner = await Owner.findByPk(decodedPayload.id);
    if (!owner || !owner.hashed_token) {
      return res.status(403).send({ message: "Access denied" });
    }

    const isMatch = await bcrypt.compare(refreshToken, owner.hashed_token);
    if (!isMatch) {
      return res.status(403).send({ message: "Refresh token doesn't match" });
    }

    const payload = {
      id: owner.id,
      email: owner.email,
      is_active: owner.is_active,
      role: "owner",
    };
    const tokens = OwnerJwtService.generateTokens(payload);

    owner.hashed_token = await bcrypt.hash(tokens.refreshToken, 7);
    await owner.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("ownerCookieRefreshTime"),
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
