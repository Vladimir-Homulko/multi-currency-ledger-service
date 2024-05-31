import { env } from 'node:process';
import { registerAs } from '@nestjs/config';

export const appConfigFactory = registerAs('app', () => ({
  port: env.PORT,
}));
