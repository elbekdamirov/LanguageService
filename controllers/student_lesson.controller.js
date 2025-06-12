const StudentLesson = require("../models/student_lesson.model");
const {
  studentLessonValidation,
  updateStudentLessonValidation,
} = require("../validations/student_lesson.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");
const Contract = require("../models/contract.model");
const Student = require("../models/student.model");

const create = async (req, res) => {
  try {
    const { error, value } = studentLessonValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const { is_there, reason, contractId, studentId } = value;

    const newStudentLesson = await StudentLesson.create({
      is_there,
      reason,
      contractId,
      studentId,
    });

    res.status(201).send(newStudentLesson);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const lessons = await StudentLesson.findAll({
      include: [
        {
          model: Contract,
          attributes: ["start_time", "end_time"],
        },
        {
          model: Student,
          attributes: ["full_name", "email"],
        },
      ],
    });
    res.status(200).send(lessons);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const lesson = await StudentLesson.findByPk(req.params.id, {
      include: [
        {
          model: Contract,
          attributes: ["start_time", "end_time"],
        },
        {
          model: Student,
          attributes: ["full_name", "email"],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).send({ error: "Student lesson not found" });
    }

    res.status(200).send(lesson);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = updateStudentLessonValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const lesson = await StudentLesson.findByPk(req.params.id);
    if (!lesson) {
      return res.status(404).send({ error: "Student lesson not found" });
    }

    const { is_there, reason, contractId, studentId } = value;

    await lesson.update({ is_there, reason, contractId, studentId });

    res.status(200).send(lesson);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const lesson = await StudentLesson.findByPk(req.params.id);

    if (!lesson) {
      return res.status(404).send({ error: "Student lesson not found" });
    }

    await lesson.destroy();

    res.status(200).send({ message: "Student lesson deleted successfully" });
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
