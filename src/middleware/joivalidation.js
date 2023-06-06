const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");
const { join } = require("path");
const { validation } = require("../utils/constants");

const validationSchema = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      const message = error.message.replace(/"/g, "");
      return res.status(422).json(validation(message));
    }
  };
};

// User Dragon Object

const schemas = {
  User: {
    create: Joi.object({
      username: Joi.string().required(),
      password: new PasswordComplexity({
        min: 8,
        max: 25,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
      }),
      confirmpassword: Joi.string().required().valid(Joi.ref("password")),
    }),
    login: Joi.object({
      username: Joi.string().required(),
      password: new PasswordComplexity({
        min: 8,
        max: 25,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
      }),
    }),
  },
  Product: {
    create: Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      description: Joi.string().required(),
      quantity: Joi.number().required(),
    }),
  },
};
module.exports = { validationSchema, schemas };
