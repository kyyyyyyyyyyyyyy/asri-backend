import jwt, { type SignOptions } from "jsonwebtoken";
import type { UserRole } from "../constants/role.constant.js";

export type JwtPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

const accessSecret = process.env.JWT_ACCESS_SECRET ?? "development-access-secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET ?? "development-refresh-secret";
const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn } as SignOptions);
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn } as SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, accessSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, refreshSecret) as JwtPayload;
}
