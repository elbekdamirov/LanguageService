const Joi = require("joi");

exports.ownerValidation = (body) => {
  const schema = Joi.object({
    full_name: Joi.string().max(50).required().messages({
      "string.empty": "Full name is required",
      "string.max": "Full name should not exceed 50 characters",
      "any.required": "Full name is required",
    }),

    phone: Joi.string()
      .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/)
      .messages({
        "string.pattern.base":
          "Phone number must match the format: 00-000-00-00",
      }),

    email: Joi.string().email().max(50).required().messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
      "string.max": "Email should not exceed 50 characters",
      "any.required": "Email is required",
    }),

    is_active: Joi.boolean().messages({
      "boolean.base": "is_active must be true or false",
    }),

    password: Joi.string().required().messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.updateOwnerValidation = (body) => {
  const schema = Joi.object({
    full_name: Joi.string().max(50).messages({
      "string.empty": "Full name cannot be empty",
      "string.max": "Full name should not exceed 50 characters",
    }),

    phone: Joi.string()
      .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/)
      .messages({
        "string.pattern.base":
          "Phone number must match the format: 00-000-00-00",
      }),

    email: Joi.string().email().max(50).messages({
      "string.email": "Email must be valid",
      "string.max": "Email should not exceed 50 characters",
    }),

    is_active: Joi.boolean().messages({
      "boolean.base": "is_active must be true or false",
    }),
    
    password: Joi.string().messages({
      "string.empty": "Password cannot be empty",
    }),
  }).min(1);

  return schema.validate(body, { abortEarly: false });
};
