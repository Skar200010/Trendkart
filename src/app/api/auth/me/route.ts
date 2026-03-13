import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "trendkart-secret-key";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      name: string;
      role: string;
    };

    if (decoded.role === "admin") {
      return NextResponse.json({
        user: {
          id: decoded.userId,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
        },
      });
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
