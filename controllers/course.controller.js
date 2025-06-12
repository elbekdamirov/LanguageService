const Course = require("../models/course.model");
const {
  courseValidation,
  updateCourseValidation,
} = require("../validations/course.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");
const Owner = require("../models/owner.model");

const create = async (req, res) => {
  try {
    const { error, value } = courseValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const { name, language, level, price, ownerId } = value;

    const newCourse = await Course.create({
      name,
      language,
      level,
      price,
      ownerId,
    });

    res.status(201).send(newCourse);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: {
        model: Owner,
        attributes: ["full_name", "email"],
      },
    });
    res.status(200).send(courses);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    res.status(200).send(course);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = updateCourseValidation(req.body);
    if (error) {
      return sendErrorResponse(error, res, 400);
    }

    const course = await Course.findByPk(req.params.id, {
      include: {
        model: Owner,
        attributes: ["full_name", "email"],
      },
    });
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    const { name, language, level, price, ownerId } = value;

    await course.update({ name, language, level, price, ownerId });

    res.status(200).send(course);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    await course.destroy();

    res.status(200).send({ message: "Course deleted successfully" });
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
