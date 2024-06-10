import { schema, rules } from '@ioc:Adonis/Core/Validator';
import SchemaMessages from './SchemaMessages';

export const registerSchema = {
  schema: schema.create({
    firstName: schema.string([rules.trim(), rules.required()]),
    lastName: schema.string([rules.trim(), rules.required()]),
    email: schema.string([
      rules.email(),
      rules.trim(),
      rules.unique({ table: 'users', column: 'email' }),
      rules.required(),
    ]),
    password: schema.string([rules.minLength(8), rules.required()]),
  }),
  messages: SchemaMessages,
};
