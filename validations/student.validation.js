const Joi = require("joi");

exports.studentValidation = (body) => {
  const schema = Joi.object({
    full_name: Joi.string().max(50).required().messages({
      "string.empty": "Full name is required",
      "string.max": "Full name should not exceed 50 characters",
      "any.required": "Full name is required",
    }),

    phone: Joi.string()
      .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Phone number must be in format XX-XXX-XX-XX",
        "any.required": "Phone number is required",
      }),

    email: Joi.string().email().max(50).required().messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
      "string.max": "Email should not exceed 50 characters",
      "any.required": "Email is required",
    }),

    birth_date: Joi.date().iso().required().messages({
      "date.base": "Birth date must be a valid date",
      "date.format": "Birth date must be in YYYY-MM-DD format",
      "any.required": "Birth date is required",
    }),

    password: Joi.string().min(6).max(30).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password should be at least 6 characters",
      "string.max": "Password should not exceed 30 characters",
      "any.required": "Password is required",
    }),

    confirm_password: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords didn't match",
        "string.empty": "Confirm password is required",
        "any.required": "Confirm password is required",
      }),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.updateStudentValidation = (body) => {
  const schema = Joi.object({
    full_name: Joi.string().max(50).messages({
      "string.empty": "Full name cannot be empty",
      "string.max": "Full name should not exceed 50 characters",
    }),

    phone: Joi.string()
      .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/)
      .messages({
        "string.empty": "Phone number cannot be empty",
        "string.pattern.base": "Phone number must be in format XX-XXX-XX-XX",
      }),

    email: Joi.string().email().max(50).messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email cannot be empty",
      "string.max": "Email should not exceed 50 characters",
    }),

    birth_date: Joi.date().iso().messages({
      "date.base": "Birth date must be a valid date",
      "date.format": "Birth date must be in YYYY-MM-DD format",
    }),

    password: Joi.forbidden(),
    confirm_password: Joi.forbidden(),
  }).min(1);

  return schema.validate(body, { abortEarly: false });
};
