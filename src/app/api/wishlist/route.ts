import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const wishlist = await Wishlist.findOne({ userId: user.userId });

    return NextResponse.json(wishlist || { items: [] });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { productId, title, image, price } = body;

    if (!productId || !title || !image || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let wishlist = await Wishlist.findOne({ userId: user.userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: user.userId,
        items: [{ productId, title, image, price, addedAt: new Date() }]
      });
    } else {
      const existingItem = wishlist.items.find(
        (item: any) => item.productId === productId
      );

      if (!existingItem) {
        wishlist.items.push({ productId, title, image, price, addedAt: new Date() });
        await wishlist.save();
      }
    }

    return NextResponse.json(wishlist, { status: 200 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ userId: user.userId });
    if (wishlist) {
      wishlist.items = wishlist.items.filter((item: any) => item.productId !== productId);
      await wishlist.save();
    }

    return NextResponse.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
  }
}
