const Joi = require("joi");

exports.contractValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required().messages({
      "string.empty": "Contract name is required",
      "string.max": "Contract name should not exceed 50 characters",
      "any.required": "Contract name is required",
    }),

    start_time: Joi.date().iso().required().messages({
      "date.base": "Start date must be a valid date",
      "date.format": "Start date must be in YYYY-MM-DD format",
      "any.required": "Start date is required",
    }),

    end_time: Joi.date()
      .iso()
      .greater(Joi.ref("start_time"))
      .required()
      .messages({
        "date.base": "End date must be a valid date",
        "date.format": "End date must be in YYYY-MM-DD format",
        "date.greater": "End date must be after start date",
        "any.required": "End date is required",
      }),

    total_price: Joi.number().positive().precision(2).required().messages({
      "number.base": "Total price must be a number",
      "number.positive": "Total price must be positive",
      "number.precision": "Total price can have maximum 2 decimal places",
      "any.required": "Total price is required",
    }),

    status: Joi.string().valid("ENDED", "ACTIVE", "PENDING").messages({
      "any.only": "Status must be one of ENDED, ACTIVE, or PENDING",
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

exports.updateContractValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().max(50).messages({
      "string.empty": "Contract name cannot be empty",
      "string.max": "Contract name should not exceed 50 characters",
    }),

    start_time: Joi.date().iso().messages({
      "date.base": "Start date must be a valid date",
      "date.format": "Start date must be in YYYY-MM-DD format",
    }),

    end_time: Joi.date().iso().greater(Joi.ref("start_time")).messages({
      "date.base": "End date must be a valid date",
      "date.format": "End date must be in YYYY-MM-DD format",
      "date.greater": "End date must be after start date",
    }),

    total_price: Joi.number().positive().precision(2).messages({
      "number.base": "Total price must be a number",
      "number.positive": "Total price must be positive",
      "number.precision": "Total price can have maximum 2 decimal places",
    }),

    status: Joi.string().valid("ENDED", "ACTIVE", "PENDING").messages({
      "any.only": "Status must be one of ENDED, ACTIVE, or PENDING",
    }),

    courseId: Joi.number().integer().positive().messages({
      "number.base": "Course ID must be a number",
      "number.integer": "Course ID must be an integer",
      "number.positive": "Course ID must be positive",
    }),

    studentId: Joi.number().integer().positive().messages({
      "number.base": "Student ID must be a number",
      "number.integer": "Student ID must be an integer",
      "number.positive": "Student ID must be positive",
    }),
  }).min(1);

  return schema.validate(body, { abortEarly: false });
};
