"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ProductSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    image: { type: String, default: 'https://via.placeholder.com/300x400?text=Sin+Imagen' },
    category: { type: String, enum: ['remeras', 'buzos', 'pantalones', 'camisas', 'bermudas'], required: true },
}, { collection: '2025' });
//# sourceMappingURL=product.schema.js.map