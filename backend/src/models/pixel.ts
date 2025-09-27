import mongoose, { Schema, Types, Document } from "mongoose";

// Interface for event types
interface IEventTypes {
    PageView: boolean;
    Purchase: boolean;
    Lead: boolean;
}

// Main interface for the Pixel document
export interface IPixel extends Document {
    _id: Types.ObjectId;
    facebookPixel: boolean;
    apiConversion: boolean;
    pixelId: string;
    accessToken?: string;
    eventTypes: IEventTypes;
    createdAt: Date;
    updatedAt: Date;
}

// Schema for event types
const eventTypesSchema = new Schema<IEventTypes>(
    {
        PageView: {
            type: Boolean,
            required: true,
            default: false
        },
        Purchase: {
            type: Boolean,
            required: true,
            default: false
        },
        Lead: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    { _id: false } // Disable _id for subdocument
);

// Main pixel schema
const pixelSchema = new Schema<IPixel>(
    {
        facebookPixel: {
            type: Boolean,
            required: true,
            default: false
        },
        apiConversion: {
            type: Boolean,
            required: true,
            default: false
        },
        pixelId: {
            type: String,
            required: true
        },
        accessToken: {
            type: String,
            required: false,
            default: ""
        },
        eventTypes: {
            type: eventTypesSchema,
            required: true
        }
    },
    {
        timestamps: true // This automatically adds createdAt and updatedAt
    }
);

export default mongoose.model<IPixel>('Pixel', pixelSchema);