import 'dotenv/config';
import 'reflect-metadata';
import { DataSource, } from 'typeorm';

const entitiesPath = `${__dirname}/entities/**/*.entity{.js,.ts}`;
const migrationsPath = `${__dirname}/migration/*`;

const isProd = process.env.PRODUCTION === 'TRUE' ? true : false;
const dbUrl = process.env.DATABASE_URL;

const AppDataSource = new DataSource({
    type: 'postgres',
    url: dbUrl,
    entities: [entitiesPath],
    migrations: [migrationsPath],
    synchronize: !isProd,
    logging: false,
});

export default AppDataSource;
