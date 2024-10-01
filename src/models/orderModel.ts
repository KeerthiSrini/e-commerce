import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrderItem {
    _id: Types.ObjectId;
    productId: mongoose.Schema.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    _id: Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled';
    shippingAddress: {
        street: string;
        city: string;
        zipCode: string;
        country: string;
    };
    paymentMethod: 'credit_card' | 'net_banking' | 'cash_on_delivery';
    paymentStatus: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const OrderSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'canceled'], default: 'pending' },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: { type: String, enum: ['credit_card', 'paypal', 'bank_transfer'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    }, {
    timestamps: true
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);