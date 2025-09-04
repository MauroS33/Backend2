import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
export declare class ProductsService {
    private productModel;
    constructor(productModel: Model<Product>);
    findAll(): Promise<Product[]>;
}
