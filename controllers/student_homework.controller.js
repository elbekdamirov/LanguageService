const { sendErrorResponse } = require("../helpers/send_error_response");
const StudentHomework = require("../models/student_homework.model");
const {
  studentHomeworkValidation,
  updateStudentHomeworkValidation,
} = require("../validations/student_homework.validation");

const create = async (req, res) => {
  try {
    const { error, value } = studentHomeworkValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const { answer, status, homeworkId, studentId } = value;

    const studentHomework = await StudentHomework.create({
      answer,
      status,
      homeworkId,
      studentId,
    });

    res
      .status(201)
      .send({ message: "StudentHomework created", data: studentHomework });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const studentHomeworks = await StudentHomework.findAll();
    res.status(200).send({ data: studentHomeworks });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const studentHomework = await StudentHomework.findByPk(id);

    if (!studentHomework) {
      return res.status(404).send({ error: "StudentHomework not found" });
    }

    res.status(200).send({ data: studentHomework });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = updateStudentHomeworkValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const { id } = req.params;
    const studentHomework = await StudentHomework.findByPk(id);

    if (!studentHomework) {
      return res.status(404).send({ error: "StudentHomework not found" });
    }

    const { answer, status, homeworkId, studentId } = value;

    await studentHomework.update({
      answer,
      status,
      homeworkId,
      studentId,
    });

    res
      .status(200)
      .send({ message: "StudentHomework updated", data: studentHomework });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const studentHomework = await StudentHomework.findByPk(id);

    if (!studentHomework) {
      return res.status(404).send({ error: "StudentHomework not found" });
    }

    await studentHomework.destroy();
    res.status(200).send({ message: "StudentHomework deleted" });
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
