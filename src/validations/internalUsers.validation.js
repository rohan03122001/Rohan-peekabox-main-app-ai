const Joi = require('joi');
const { CONSTANTS } = require('../config/constants');

const emailSchema = Joi.string()
  .email()
  .min(5)
  .max(255)
  .required()
  .trim()
  .lowercase()
  // .pattern(/@peekabox\.co$/)
  .messages({
    'string.pattern.base': `Invalid email format`,
  }); // TODO: uncomment
const passwordSchema = Joi.string().min(8).max(255).required();
const otpSchema = Joi.string().length(6).required(); // Assuming OTP is a 6-digit code

const triggerOTPSchema = {
  body: Joi.object({
    email: emailSchema,
    purpose: Joi.string()
      .valid(CONSTANTS.OTPPurpose.FORGOT_PASSWORD)
      .required(),
  }),
};

const verifyOTPSchema = {
  body: Joi.object({
    email: emailSchema,
    OTPValue: otpSchema,
    password: Joi.string().min(8).max(100).required(),
    purpose: Joi.string()
      .valid(CONSTANTS.OTPPurpose.FORGOT_PASSWORD)
      .required(),
  }),
};

const logInSchema = {
  body: Joi.object({
    email: emailSchema,
    password: passwordSchema,
  }),
};

const updatePasswordSchema = {
  body: Joi.object({
    existingPassword: Joi.string().min(8).max(100).required(),
    updatedPassword: Joi.string().min(8).max(100).required(),
  }),
};

const refreshSchema = {
  body: Joi.object({
    email: emailSchema,
  }),
};

const logOutSchema = {
  body: Joi.object({}),
};

const InternalValidation = {
  triggerOTPSchema,
  verifyOTPSchema,
  logInSchema,
  refreshSchema,
  logOutSchema,
  updatePasswordSchema,
};

module.exports = { InternalValidation };
