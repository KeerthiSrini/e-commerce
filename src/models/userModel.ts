import mongoose, { Schema, Types } from 'mongoose';

export interface IUser {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobileNumber: number;
    role: string;
    status: string;
    profilePicture: string;
    gender: string;
    address: string;
    state: string;
    country: string;
    city: string;
}

const userSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    mobileNumber: { type: Number },
    role: { type: String, required: true, enum: ["customer", "admin"]},
    status: { type: String, required: true, enum: ["active", "deleted", "suspended"], default: "active"},
    profilePicture: { type: String },
    gender: { type: String },
    address: { type: String },
    state: { type: String },
    country: { type: String },
    city: { type: String },
}, {
    timestamps: true,
});

export const User = mongoose.model<IUser>('User', userSchema)
