import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://maurosotelozicari:12345678nueve@cluster0.1wcb5.mongodb.net/FourBros?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}