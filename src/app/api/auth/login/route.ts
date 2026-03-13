import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "trendkart-secret-key";
const ADMIN_EMAIL = "admin@trendkart.com";
const ADMIN_PASSWORD = "trendkart123";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    let user = null;
    let role = "customer";

    if (email.toLowerCase() === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
      role = "admin";
      user = { _id: "admin", name: "Admin", email: ADMIN_EMAIL, role: "admin" };
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
      role = user.role;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name, role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email, role },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 30,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
