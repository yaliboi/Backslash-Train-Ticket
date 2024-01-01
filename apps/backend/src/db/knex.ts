import Knex from 'knex'
import dotenv from 'dotenv'

dotenv.config();

export const db = Knex({
    client: "postgresql",
    connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: +process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        user: 'postgres'
    },
})