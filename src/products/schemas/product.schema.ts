import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: '2025' }) // Si la aplicacion se lanza para el año proximo cambiar el nombre a la coleccion aqui y en mongoose RECORDAR
export class Product extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop({
    default: 'https://via.placeholder.com/300x400?text=Sin+Imagen',
  })
  image: string;

  @Prop({
    required: true,
    enum: ['remeras', 'buzos', 'pantalones', 'camisas', 'bermudas'],
  })
  category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);