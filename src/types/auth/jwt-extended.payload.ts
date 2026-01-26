import jwt, { JwtPayload } from "jsonwebtoken";

export interface JwtUserPayload extends JwtPayload {
  email: string;
  id: string;
}