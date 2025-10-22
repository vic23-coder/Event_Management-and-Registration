import dotenv from 'dotenv';

dotenv.config();

export default {
  ENVIRONMENT: process.env.ENVIRONMENT || "dev",
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_NAME: process.env.DATABASE_NAME || "event_management_system",
  DATABASE_USERNAME: process.env.DATABASE_USERNAME || "victor",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "victor23",
  DATABASE_HOST: process.env.DATABASE_HOST || "localhost",
  DATABASE_PORT: Number(process.env.DATABASE_PORT) || 3306,
  DATABASE_DIALECT: process.env.DATABASE_DIALECT || "mysql",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.example.com",
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || "dev",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || "password",
  SMTP_SECURE: process.env.SMTP_SECURE === "true" || false,
  TYPICODE_BASE_URL: process.env.TYPICODE_BASE_URL || "https://jsonplaceholder.typicode.com/users",
  TYPICODE_BASE_API_KEY: process.env.TYPICODE_BASE_API_KEY || "your_api_key_here",
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
};
    