import { Schema, Document } from 'mongoose';

export const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    image: { type: String, default: 'https://via.placeholder.com/300x400?text=Sin+Imagen' },
    category: { type: String, enum: ['remeras', 'buzos', 'pantalones', 'camisas', 'bermudas'], required: true },
  },
  { collection: '2025' }
);

export interface Product extends Document {
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}