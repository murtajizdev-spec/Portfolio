import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface INewsletterSubscriberDocument extends Document {
  email: string;
  subscribedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriberDocument>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subscribedAt: { type: Date, default: Date.now },
});

export const NewsletterSubscriber: Model<INewsletterSubscriberDocument> =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriberDocument>(
    "NewsletterSubscriber",
    NewsletterSubscriberSchema,
  );
