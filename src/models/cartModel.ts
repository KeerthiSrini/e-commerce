import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICartItem {
    _id: Types.ObjectId;
    productId: mongoose.Schema.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
}

export interface ICart extends Document {
    _id: Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    items: ICartItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema: Schema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const CartSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [CartItemSchema],
    totalAmount: { type: Number, required: true, default: 0 },
    }, {
    timestamps: true
});

export const Cart = mongoose.model<ICart>('Cart', CartSchema);

