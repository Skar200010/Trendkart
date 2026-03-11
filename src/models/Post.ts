import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },

    slug: { type: String, required: true, unique: true, lowercase: true },

    content: { type: String, required: true },

    category: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Post ||
  mongoose.model<IPost>("Post", PostSchema);
