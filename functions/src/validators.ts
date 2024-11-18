import Joi from "joi";

export const validateRegistration = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
  });

  return schema.validate(data);
};

export const validateUserUpdate = (data: any) => {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
  });

  return schema.validate(data);
};
