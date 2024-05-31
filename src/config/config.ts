import { registerAs } from '@nestjs/config';
import { appConfigFactory } from './app.config';
import { typeOrmConfigFactory } from './typeorm.config';

export const config: ReturnType<typeof registerAs>[] = [
  appConfigFactory,
  typeOrmConfigFactory,
];
