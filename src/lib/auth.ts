import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "trendkart-secret-key";

export interface UserPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function getUserFromToken(request: Request): Promise<UserPayload | null> {
  try {
    const token = request.headers.get("cookie")?.split("token=")[1]?.split(";")[0]
      || request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function requireAuth(request: Request) {
  return async (req: NextRequest) => {
    const user = await getUserFromToken(req);
    if (!user) {
      return { authorized: false, user: null };
    }
    return { authorized: true, user };
  };
}
