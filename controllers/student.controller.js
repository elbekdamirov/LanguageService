const { sendErrorResponse } = require("../helpers/send_error_response");
const Student = require("../models/student.model");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const config = require("config");
const {
  studentValidation,
  updateStudentValidation,
} = require("../validations/student.validation");
const { StudentJwtService } = require("../services/jwt.service");
const { studentMailService } = require("../services/mail.service");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { error, value } = studentValidation(req.body);

    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const { full_name, phone, email, birth_date, password, confirm_password } =
      value;

    const candidate = await Student.findOne({ where: { email } });
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
    )}/api/students/activate/${activation_link}`;

    await studentMailService.sendMail(email, link);

    const newData = await Student.create({
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
      role: "student",
    };

    const tokens = StudentJwtService.generateTokens(payload);
    newData.hashed_token = await bcrypt.hash(tokens.refreshToken, 7);
    await newData.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("studentCookieRefreshTime"),
    });

    res.status(201).send({
      message: "New Student Added. Check your email",
      student: { id: newData.id, full_name, email },
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return sendErrorResponse({ message: "User not found" }, res, 404);
    }

    if (!student.is_active) {
      return sendErrorResponse(
        { message: "Account is not activated" },
        res,
        403
      );
    }

    const isMatch = await bcrypt.compare(password, student.hashed_password);
    if (!isMatch) {
      return sendErrorResponse({ message: "Incorrect password" }, res, 400);
    }

    const payload = {
      id: student.id,
      email: student.email,
      is_active: student.is_active,
      role: "student",
    };

    const tokens = StudentJwtService.generateTokens(payload);
    student.hashed_token = await bcrypt.hash(tokens.refreshToken, 7);
    await student.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("studentCookieRefreshTime"),
    });

    res.send({
      message: "Login successful",
      student: { id: student.id, full_name: student.full_name, email },
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

    const students = await Student.findAll({
      where: { hashed_token: { [Op.ne]: null } },
    });

    let matchedStudent = null;

    for (const student of students) {
      const isMatch = await bcrypt.compare(refreshToken, student.hashed_token);
      if (isMatch) {
        matchedStudent = student;
        break;
      }
    }

    if (!matchedStudent) {
      return res.status(400).send({ message: "Invalid refresh token" });
    }

    matchedStudent.hashed_token = null;
    await matchedStudent.save();

    res.clearCookie("refreshToken");

    return res.send({ message: "Successfully logged out" });
  } catch (error) {
    return sendErrorResponse(error, res);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await Student.findAll();
    res.status(200).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const data = await Student.findByPk(req.params.id);
    if (!data) {
      return sendErrorResponse({ message: "Student not found" }, res, 404);
    }
    res.status(200).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = updateStudentValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }

    await student.update(value);
    res.send({ message: "Student updated", student });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const data = await Student.findByPk(req.params.id);
    if (!data) {
      return sendErrorResponse({ message: "Student not found" }, res, 404);
    }

    await data.destroy();
    res.status(200).send({ message: "Student deleted" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const activate = async (req, res) => {
  try {
    const { link } = req.params;

    const user = await Student.findOne({ where: { activation_link: link } });

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
    sendErrorResponse(error, res);
  }
};

const changePassword = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { old_password, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
      return res.status(400).send({ message: "Passwords do not match" });
    }

    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(old_password, student.hashed_password);
    if (!isMatch) {
      return res.status(401).send({ message: "Old password is incorrect" });
    }

    student.hashed_password = await bcrypt.hash(new_password, 7);
    await student.save();

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

    const decodedPayload = await StudentJwtService.verifyRefreshToken(
      refreshToken
    );
    if (!decodedPayload) {
      return res.status(403).send({ message: "Invalid refresh token" });
    }

    const student = await Student.findByPk(decodedPayload.id);
    if (!student || !student.hashed_token) {
      return res.status(403).send({ message: "Access denied" });
    }

    const isMatch = await bcrypt.compare(refreshToken, student.hashed_token);
    if (!isMatch) {
      return res.status(403).send({ message: "Refresh token doesn't match" });
    }

    const payload = {
      id: student.id,
      email: student.email,
      is_active: student.is_active,
      role: "student",
    };
    const tokens = StudentJwtService.generateTokens(payload);

    student.hashed_token = await bcrypt.hash(tokens.refreshToken, 7);
    await student.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("studentCookieRefreshTime"),
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
