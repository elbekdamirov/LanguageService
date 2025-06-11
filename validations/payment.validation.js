const Joi = require("joi");

exports.paymentValidation = (body) => {
  const schema = Joi.object({
    amount: Joi.number().precision(2).positive().required().messages({
      "number.base": "Amount must be a number",
      "number.positive": "Amount must be positive",
      "number.precision": "Amount can have at most 2 decimal places",
      "any.required": "Amount is required",
    }),

    method: Joi.string().valid("CARD", "CASH", "ONLINE").required().messages({
      "any.only": "Payment method must be either CARD, CASH, or ONLINE",
      "any.required": "Payment method is required",
    }),

    date: Joi.date().required().messages({
      "date.base": "Date must be a valid date",
      "any.required": "Date is required",
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

exports.updatePaymentValidation = (body) => {
  const schema = Joi.object({
    amount: Joi.number().precision(2).positive().messages({
      "number.base": "Amount must be a number",
      "number.positive": "Amount must be positive",
      "number.precision": "Amount can have at most 2 decimal places",
    }),

    method: Joi.string().valid("CARD", "CASH", "ONLINE").messages({
      "any.only": "Payment method must be either CARD, CASH, or ONLINE",
    }),

    date: Joi.date().messages({
      "date.base": "Date must be a valid date",
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
