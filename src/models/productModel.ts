import mongoose, { Schema, Types } from 'mongoose';

export interface IProduct {
    _id: Types.ObjectId;
    productName: string;
    productDescription: string;
    image: string;
    originalPrice: number;
    discountPrice: number;
    sellingPrice: number;
    unitOfMeasure: number;
    hsnCode: string;
    status: string;
}

const productSchema = new Schema({
    productName: { type: String},
    productDescription: { type: String},
    image: { type: String},
    originalPrice: { type: Number },
    discountPrice: { type: Number },
    sellingPrice: { type: Number},
    quantity: { type: Number },
    unitOfMeasure: { type: Number },
    hsnCode: { type: String },
    status: { type: String, required: true, enum: ["ACTIVE", "DELETED", "SUSPENDED"], default: "ACTIVE"},
}, {
    timestamps: true,
});

export const Product = mongoose.model<IProduct>('Product', productSchema)
