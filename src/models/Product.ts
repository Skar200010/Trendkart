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
    },

    brand: { type: String, required: true, trim: true },

    price: { type: Number, required: true },

    discount: { type: Number, default: 0 },

    rating: { type: Number, default: 0, min: 0, max: 5 },

    image: { type: String, required: true },

    affiliateLink: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
