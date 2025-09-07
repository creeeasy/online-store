import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../types";

export const generateToken = (payload: JwtPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const options: SignOptions = {};
  if (process.env.JWT_EXPIRE) {
    options.expiresIn = process.env.JWT_EXPIRE as SignOptions['expiresIn']; // e.g., "1d", "7h"
  }

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};
