const { sendErrorResponse } = require("../helpers/send_error_response");
const Student = require("../models/student.model");
const bcrypt = require("bcrypt");

const create = async (req, res) => {
  try {
    const {
      full_name,
      phone,
      email,
      birth_date,
      is_active,
      password,
      confirm_password,
    } = req.body;

    const candidate = await Student.findOne({ where: { email } });
    if (candidate) {
      return sendErrorResponse(
        { message: "This user already exists" },
        res,
        400
      );
    }

    if (password !== confirm_password) {
      sendErrorResponse({ message: "Passwords didn't match" }, res, 400);
    }

    hashed_password = await bcrypt.hash(password, 7);

    const newData = await Student.create({
      full_name,
      phone,
      email,
      birth_date,
      hashed_password,
      is_active,
    });

    const payload = {
      id: newData.id,
      email: newData.email,
      role: "student",
    };

    res.status(201).send({ message: "New Student Added", newData });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
