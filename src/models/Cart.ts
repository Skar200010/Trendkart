import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

const CartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true, unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

CartSchema.index({ userId: 1 });

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
