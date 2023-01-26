import * as dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";

const database = mysql.createPool({
  host: process.env.DB_HOST, // address of the server
  port: parseInt(process.env.DB_PORT ?? "3306"), // port of the DB server (mysql), not to be confused with the APP_PORT !
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default database;
