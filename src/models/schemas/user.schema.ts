import Joi from "joi";

import { User } from "#/models/user.model";

export const getUserSchema = Joi.object<User>({
  userId: Joi.string().required().min(2).max(20),
});

export const createUserSchema = Joi.object<User>({
  description: Joi.string().min(2).max(0),
  name: Joi.string().required().min(1).max(20),
  email: Joi.string().required().min(1).max(20),
  status: Joi.string().required().min(1).max(20),
  userId: Joi.string().required().min(1).max(20),
  phoneNumbers: Joi.string().required().min(1).max(20),
}).or("id", "email");
