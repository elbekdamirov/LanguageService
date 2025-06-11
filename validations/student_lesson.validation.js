const Joi = require("joi");

exports.studentLessonValidation = (body) => {
  const schema = Joi.object({
    is_there: Joi.boolean().required().messages({
      "boolean.base": "is_there must be true or false",
      "any.required": "is_there is required",
    }),

    reason: Joi.string().allow("").optional().messages({
      "string.base": "Reason must be a string",
    }),

    contractId: Joi.number().integer().positive().required().messages({
      "number.base": "Contract ID must be a number",
      "number.integer": "Contract ID must be an integer",
      "number.positive": "Contract ID must be positive",
      "any.required": "Contract ID is required",
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

exports.updateStudentLessonValidation = (body) => {
  const schema = Joi.object({
    is_there: Joi.boolean().messages({
      "boolean.base": "is_there must be true or false",
    }),

    reason: Joi.string().allow("").messages({
      "string.base": "Reason must be a string",
    }),

    contractId: Joi.number().integer().positive().messages({
      "number.base": "Contract ID must be a number",
      "number.integer": "Contract ID must be an integer",
      "number.positive": "Contract ID must be positive",
    }),

    studentId: Joi.number().integer().positive().messages({
      "number.base": "Student ID must be a number",
      "number.integer": "Student ID must be an integer",
      "number.positive": "Student ID must be positive",
    }),
  }).min(1);

  return schema.validate(body, { abortEarly: false });
};
