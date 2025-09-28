import mongoose, { Schema, Document } from 'mongoose';

export interface IBotDetection extends Document {
  activeBotScore: boolean;
  botScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const BotDetectionSchema: Schema = new Schema(
  {
    activeBotScore: {
      type: Boolean,
      required: true,
      default: false,
    },
    botScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create a unique index to ensure only one bot detection configuration exists
BotDetectionSchema.index({}, { unique: true });

export const BotDetection = mongoose.model<IBotDetection>('BotDetection', BotDetectionSchema);
