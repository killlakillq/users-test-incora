import * as Joi from 'joi';

export const userSchema = Joi.object().keys({
  firstName: Joi.string()
    .min(3)
    .max(30)
    .messages({ 'Wrong format': 'First name must have at least 3 characters' })
    .required(),
  lastName: Joi.string()
    .min(3)
    .max(30)
    .messages({ 'Wrong format': 'Last name must have at least 3 characters' })
    .required(),
  email: Joi.string()
    .email()
    .messages({ 'Wrong format': 'Email must have a valid format' })
    .required(),
  phone: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({ 'Wrong format': 'Phone number must have 10 digits.' })
    .required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .messages({ 'Wrong format': 'Password must have at least 8 characters' })
    .required()
});

export const loginUserSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .messages({ 'Wrong format': 'Email must have a valid format' })
    .required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .messages({ 'Wrong format': 'Password must have at least 8 characters' })
    .required()
});
