import Joi from 'joi';

export const configurationValidate = Joi.object({
  PORT: Joi.number().integer(),
  NODE_ENV: Joi.string().required(),
  UI_URL: Joi.string().required(),
  UI_LOCAL_URL: Joi.string().required(),
  APP_DOMAIN: Joi.string().required(),
  APP_ID: Joi.string().required(),

  THROTTLE_TTL: Joi.number().integer().optional(),
  THROTTLE_LIMIT: Joi.number().integer().optional(),

  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_TIME: Joi.number().integer(),
  JWT_CONFIRMATION_SECRET: Joi.string().required(),
  JWT_CONFIRMATION_TIME: Joi.number().integer(),
  JWT_RESET_PASSWORD_SECRET: Joi.string().required(),
  JWT_RESET_PASSWORD_TIME: Joi.number().integer(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_TIME: Joi.number().integer(),
  COOKIE_SECRET: Joi.string().required(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().integer(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});
