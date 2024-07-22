import 'reflect-metadata';
import { DataSource, } from 'typeorm';

const AppDataSource = () => {
    const entitiesPath = `${__dirname}/entities/**/*.entity{.js,.ts}`;
    return new DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [entitiesPath],
        synchronize: true,
        logging: false,
    });
}

export default AppDataSource;
