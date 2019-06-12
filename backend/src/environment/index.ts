import * as dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "T6Y3JRYmL6";
export const JWT_TIME = process.env.JWT_TIME || "1d";

export const ROOT_ADMIN_EMAIL = process.env.ROOT_ADMIN_EMAIL || "1";
export const ROOT_ADMIN_PASS = process.env.ROOT_ADMIN_PASS || "1";
export const ROOT_ADMIN_FIRST_NAME =
  process.env.ROOT_ADMIN_FIRST_NAME || "Root";
export const ROOT_ADMIN_LAST_NAME = process.env.ROOT_ADMIN_LAST_NAME || "Admin";
export const ROOT_ADMIN_ADDRESS = process.env.ROOT_ADMIN_ADDRESS || "server";
export const ROOT_ADMIN_PERSON_NUMBER =
  process.env.ROOT_ADMIN_PERSON_NUMBER || "127.0.0.1";
export const ROOT_ADMIN_PHONE = process.env.ROOT_ADMIN_PHONE || "127.0.0.1";

export const DEVELOPMENT = "development";
export const PRODUCTION = "production";

export const BACKEND_HOST = process.env.BACKEND_HOST || "http://localhost";
export const BACKEND_PORT = process.env.BACKEND_PORT || 3050;

export const FRONTEND_HOST = process.env.FRONTEND_HOST || "http://localhost";
export const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;

export const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

export const MAX_PW = 18;
export const MIN_PW = process.env.MIN_PW || 3;
