import mongoose, { Schema, Document } from "mongoose";

export interface IWishlistItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  addedAt: Date;
}

export interface IWishlist extends Document {
  userId: string;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
});

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: [WishlistItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema);
