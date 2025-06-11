const Joi = require("joi");

exports.courseValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required().messages({
      "string.empty": "Course name is required",
      "string.max": "Course name should not exceed 50 characters",
      "any.required": "Course name is required",
    }),

    language: Joi.string().max(50).required().messages({
      "string.empty": "Language is required",
      "string.max": "Language should not exceed 50 characters",
      "any.required": "Language is required",
    }),

    level: Joi.string().max(50).required().messages({
      "string.empty": "Level is required",
      "string.max": "Level should not exceed 50 characters",
      "any.required": "Level is required",
    }),

    price: Joi.number().precision(2).positive().messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be positive",
      "number.precision": "Price can have maximum 2 decimal places",
    }),

    ownerId: Joi.number().integer().positive().required().messages({
      "number.base": "Owner ID must be a number",
      "number.integer": "Owner ID must be an integer",
      "number.positive": "Owner ID must be positive",
      "any.required": "Owner ID is required",
    }),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.updateCourseValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().max(50).messages({
      "string.empty": "Course name cannot be empty",
      "string.max": "Course name should not exceed 50 characters",
    }),

    language: Joi.string().max(50).messages({
      "string.empty": "Language cannot be empty",
      "string.max": "Language should not exceed 50 characters",
    }),

    level: Joi.string().max(50).messages({
      "string.empty": "Level cannot be empty",
      "string.max": "Level should not exceed 50 characters",
    }),

    price: Joi.number().precision(2).positive().messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be positive",
      "number.precision": "Price can have maximum 2 decimal places",
    }),

    ownerId: Joi.number().integer().positive().messages({
      "number.base": "Owner ID must be a number",
      "number.integer": "Owner ID must be an integer",
      "number.positive": "Owner ID must be positive",
    }),
  }).min(1);

  return schema.validate(body, { abortEarly: false });
};
