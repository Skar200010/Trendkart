import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const cart = await Cart.findOne({ userId: user.userId });

    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
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
    const { productId, title, image, price, quantity = 1 } = body;

    if (!productId || !title || !image || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let cart = await Cart.findOne({ userId: user.userId });

    if (!cart) {
      cart = await Cart.create({
        userId: user.userId,
        items: [{ productId, title, image, price, quantity }]
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item: any) => item.productId === productId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, title, image, price, quantity });
      }

      await cart.save();
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId: user.userId });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex((item: any) => item.productId === productId);
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
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

    if (productId) {
      const cart = await Cart.findOne({ userId: user.userId });
      if (cart) {
        cart.items = cart.items.filter((item: any) => item.productId !== productId);
        await cart.save();
      }
    } else {
      await Cart.deleteOne({ userId: user.userId });
    }

    return NextResponse.json({ message: "Cart updated" });
  } catch (error) {
    console.error("Error deleting from cart:", error);
    return NextResponse.json({ error: "Failed to delete from cart" }, { status: 500 });
  }
}
