import * as dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretPassword";

export const ROOT_ADMIN_EMAIL = process.env.ROOT_ADMIN_EMAIL || "1";
export const ROOT_ADMIN_PASS = process.env.ROOT_ADMIN_PASS || "1";

export const DEVELOPMENT = "development";
export const PRODUCTION = "production";

export const BACKEND_HOST = process.env.BACKEND_HOST || "localhost";
export const BACKEND_PORT = process.env.BACKEND_PORT || 3050;

export const FRONTEND_HOST = process.env.FRONTEND_HOST || "localhost";
export const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;

export const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

export const DB_RESET = process.env.DB_RESET === "true" ? true : false;

export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
