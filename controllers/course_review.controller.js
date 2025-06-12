const CourseReview = require("../models/course_review.model");
const {
  courseReviewValidation,
  updateCourseReviewValidation,
} = require("../validations/course_review.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");
const Course = require("../models/course.model");
const Student = require("../models/student.model");

const create = async (req, res) => {
  try {
    const { error, value } = courseReviewValidation(req.body);
    if (error) return sendErrorResponse(error, res, 400);

    const { rating, message, courseId, studentId } = value;

    const newReview = await CourseReview.create({
      rating,
      message,
      courseId,
      studentId,
    });

    res.status(201).send(newReview);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findAll = async (req, res) => {
  try {
    const reviews = await CourseReview.findAll({
      include: [
        {
          model: Student,
          attributes: ["full_name"],
        },
        {
          model: Course,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).send(reviews);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const findOne = async (req, res) => {
  try {
    const review = await CourseReview.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          attributes: ["full_name"],
        },
        {
          model: Course,
          attributes: ["name"],
        },
      ],
    });

    if (!review) {
      return res.status(404).send({ error: "Course review not found" });
    }

    res.status(200).send(review);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = updateCourseReviewValidation(req.body);
    if (error) return sendErrorResponse(error, res, 400);

    const review = await CourseReview.findByPk(req.params.id);
    if (!review) {
      return res.status(404).send({ error: "Course review not found" });
    }

    await review.update(value);

    res.status(200).send(review);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const review = await CourseReview.findByPk(req.params.id);
    if (!review) {
      return res.status(404).send({ error: "Course review not found" });
    }

    await review.destroy();

    res.status(200).send({ message: "Course review deleted successfully" });
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
