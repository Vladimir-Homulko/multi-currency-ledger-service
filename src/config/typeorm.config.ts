import { registerAs } from '@nestjs/config';
import { env } from 'node:process';
import { DataSource, DataSourceOptions } from 'typeorm';
import { configDotenv } from 'dotenv';

configDotenv({ path: '.env' });

const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: false,
  migrations: [__dirname + '/../migrations/*.{js,ts}'],
};

console.log('config', config);
export const typeOrmConfigFactory = registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
