const Joi = require("joi");

exports.courseReviewValidation = (body) => {
  const schema = Joi.object({
    rating: Joi.string().valid("1", "2", "3", "4", "5").required().messages({
      "string.empty": "Rating is required",
      "any.only": "Rating must be between 1 and 5",
      "any.required": "Rating is required",
    }),

    message: Joi.string().required().messages({
      "string.empty": "Review message is required",
      "any.required": "Review message is required",
    }),

    courseId: Joi.number().integer().positive().required().messages({
      "number.base": "Course ID must be a number",
      "number.integer": "Course ID must be an integer",
      "number.positive": "Course ID must be positive",
      "any.required": "Course ID is required",
    }),

    studentId: Joi.number().integer().positive().required().messages({
      "number.base": "Student ID must be a number",
      "number.integer": "Student ID must be an integer",
      "number.positive": "Student ID must be positive",
      "any.required": "Student ID is required",
    }),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.updateCourseReviewValidation = (body) => {
  const schema = Joi.object({
    rating: Joi.string().valid("1", "2", "3", "4", "5").messages({
      "string.empty": "Rating cannot be empty",
      "any.only": "Rating must be between 1 and 5",
    }),

    message: Joi.string().messages({
      "string.empty": "Review message cannot be empty",
    }),

    courseId: Joi.forbidden().messages({
      "any.unknown": "Cannot change course ID",
    }),

    studentId: Joi.forbidden().messages({
      "any.unknown": "Cannot change student ID",
    }),
  }).min(1);

  return schema.validate(body, { abortEarly: false });
};
