import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IProjectDocument extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  technologies: string[];
  thumbnail: string;
  gallery: string[];
  githubUrl?: string;
  liveUrl?: string;
  features: string[];
  challenges?: string;
  solutions?: string;
  featured: boolean;
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true, maxlength: 300 },
    fullDescription: { type: String, required: true },
    category: { type: String, required: true, trim: true, index: true },
    technologies: [{ type: String, trim: true }],
    thumbnail: { type: String, required: true },
    gallery: [{ type: String }],
    githubUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    features: [{ type: String, trim: true }],
    challenges: { type: String },
    solutions: { type: String },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: false, index: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ProjectSchema.index({ title: "text", shortDescription: "text", fullDescription: "text" });

export const Project: Model<IProjectDocument> =
  mongoose.models.Project || mongoose.model<IProjectDocument>("Project", ProjectSchema);
