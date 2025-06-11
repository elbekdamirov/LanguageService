const { sendErrorResponse } = require("../helpers/send_error_response");
const Homework = require("../models/homework.model");
const {
  homeworkValidation,
  updateHomeworkValidation,
} = require("../validations/homework.validation");

const create = async (req, res) => {
  try {
    const { error, value } = homeworkValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const { title, description, studentLessonId } = value;

    const homework = await Homework.create({
      title,
      description,
      studentLessonId,
    });

    res.status(201).send({ message: "Homework created", data: homework });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const homeworkList = await Homework.findAll();
    res.status(200).send({ data: homeworkList });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const homework = await Homework.findByPk(id);

    if (!homework) {
      return res.status(404).send({ error: "Homework not found" });
    }

    res.status(200).send({ data: homework });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = updateHomeworkValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const { id } = req.params;
    const homework = await Homework.findByPk(id);

    if (!homework) {
      return res.status(404).send({ error: "Homework not found" });
    }

    const { title, description, studentLessonId } = value;

    await homework.update({
      title,
      description,
      studentLessonId,
    });

    res.status(200).send({ message: "Homework updated", data: homework });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const homework = await Homework.findByPk(id);

    if (!homework) {
      return res.status(404).send({ error: "Homework not found" });
    }

    await homework.destroy();
    res.status(200).send({ message: "Homework deleted" });
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
