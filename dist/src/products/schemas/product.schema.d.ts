import { Schema, Document } from 'mongoose';
export declare const ProductSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
}, {
    title: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    category: "remeras" | "buzos" | "pantalones" | "camisas" | "bermudas";
}, Document<unknown, {}, import("mongoose").FlatRecord<{
    title: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    category: "remeras" | "buzos" | "pantalones" | "camisas" | "bermudas";
}>> & import("mongoose").FlatRecord<{
    title: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    category: "remeras" | "buzos" | "pantalones" | "camisas" | "bermudas";
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export interface Product extends Document {
    title: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    category: string;
}
