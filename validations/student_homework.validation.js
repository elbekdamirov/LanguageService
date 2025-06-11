const Joi = require("joi");

exports.studentHomeworkValidation = (body) => {
  const schema = Joi.object({
    answer: Joi.string().allow("").optional().messages({
      "string.base": "Answer must be a string",
    }),

    status: Joi.string()
      .valid("submitted", "not_submitted", "late")
      .required()
      .messages({
        "any.only": "Status must be one of: submitted, not_submitted, or late",
        "any.required": "Status is required",
      }),

    homeworkId: Joi.number().integer().positive().required().messages({
      "number.base": "Homework ID must be a number",
      "number.integer": "Homework ID must be an integer",
      "number.positive": "Homework ID must be positive",
      "any.required": "Homework ID is required",
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

exports.updateStudentHomeworkValidation = (body) => {
  const schema = Joi.object({
    answer: Joi.string().allow("").messages({
      "string.base": "Answer must be a string",
    }),

    status: Joi.string().valid("submitted", "not_submitted", "late").messages({
      "any.only": "Status must be one of: submitted, not_submitted, or late",
    }),

    homeworkId: Joi.number().integer().positive().messages({
      "number.base": "Homework ID must be a number",
      "number.integer": "Homework ID must be an integer",
      "number.positive": "Homework ID must be positive",
    }),

    studentId: Joi.number().integer().positive().messages({
      "number.base": "Student ID must be a number",
      "number.integer": "Student ID must be an integer",
      "number.positive": "Student ID must be positive",
    }),
  }).min(1);

  return schema.validate(body, { abortEarly: false });
};
