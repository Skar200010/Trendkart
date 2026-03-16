import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  slug: string;
  category: "men" | "women";
  brand: string;
  price: number;
  discount: number;
  rating: number;
  image: string;
  affiliateLink: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },

    slug: { type: String, required: true, unique: true, lowercase: true },

    category: {
      type: String,
      enum: ["men", "women"],
      required: true,
      index: true,
    },

    brand: { type: String, required: true, trim: true, index: true },

    price: { type: Number, required: true, index: true },

    discount: { type: Number, default: 0 },

    rating: { type: Number, default: 0, min: 0, max: 5, index: true },

    image: { type: String, required: true },

    affiliateLink: { type: String, required: true },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ title: 'text', brand: 'text' });

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
