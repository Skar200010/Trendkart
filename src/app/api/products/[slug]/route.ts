import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    let product;
    if (mongoose.Types.ObjectId.isValid(params.slug)) {
      product = await Product.findById(params.slug);
    } else {
      product = await Product.findOne({ slug: params.slug });
    }
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    
    let product;
    if (mongoose.Types.ObjectId.isValid(params.slug)) {
      product = await Product.findByIdAndUpdate(
        params.slug,
        { $set: body },
        { new: true }
      );
    } else {
      product = await Product.findOneAndUpdate(
        { slug: params.slug },
        { $set: body },
        { new: true }
      );
    }
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    let product;
    if (mongoose.Types.ObjectId.isValid(params.slug)) {
      product = await Product.findByIdAndDelete(params.slug);
    } else {
      product = await Product.findOneAndDelete({ slug: params.slug });
    }
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
