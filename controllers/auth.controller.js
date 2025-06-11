const { sendErrorResponse } = require("../helpers/send_error_response");
const Admin = require("../models/admin.model");
const Owner = require("../models/owner.model");
const Student = require("../models/student.model");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Admin.findOne({ where: { email } });
    let userType = "admin";

    if (!user) {
      user = await Owner.findOne({ where: { email } });
      userType = "owner";
    }

    if (!user) {
      user = await Student.findOne({ where: { email } });
      userType = "student";
    }

    if (!user) {
      return sendErrorResponse(
        { message: "Email or Password Incorrect" },
        res,
        400
      );
    }

    const verifyPassword = await bcrypt.compare(password, user.hashed_password);

    if (!verifyPassword) {
      return sendErrorResponse(
        { message: "Email or Password Incorrect" },
        res,
        400
      );
    }
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const logout = async (req, res) => {
  try {
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const refreshToken = async (req, res) => {
  try {
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};
