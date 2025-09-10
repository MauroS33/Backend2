import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module'; // Importa el nuevo módulo
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://maurosotelozicari:12345678nueve@cluster0.1wcb5.mongodb.net/FourBros?retryWrites=true&w=majority&appName=Cluster0', {
    }),
    ProductsModule,
    AuthModule,
    ProfileModule,
    UsersModule, // Agrega el nuevo módulo aquí
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}