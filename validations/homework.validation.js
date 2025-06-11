const Joi = require("joi");

exports.homeworkValidation = (body) => {
  const schema = Joi.object({
    title: Joi.string().max(50).required().messages({
      "string.empty": "Title is required",
      "string.max": "Title should not exceed 50 characters",
      "any.required": "Title is required",
    }),

    description: Joi.string().required().messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
    }),

    studentLessonId: Joi.number().integer().positive().required().messages({
      "number.base": "StudentLesson ID must be a number",
      "number.integer": "StudentLesson ID must be an integer",
      "number.positive": "StudentLesson ID must be positive",
      "any.required": "StudentLesson ID is required",
    }),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.updateHomeworkValidation = (body) => {
  const schema = Joi.object({
    title: Joi.string().max(50).messages({
      "string.empty": "Title cannot be empty",
      "string.max": "Title should not exceed 50 characters",
    }),

    description: Joi.string().messages({
      "string.empty": "Description cannot be empty",
    }),

    studentLessonId: Joi.number().integer().positive().messages({
      "number.base": "StudentLesson ID must be a number",
      "number.integer": "StudentLesson ID must be an integer",
      "number.positive": "StudentLesson ID must be positive",
    }),
  }).min(1);

  return schema.validate(body, { abortEarly: false });
};
