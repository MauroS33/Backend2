import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RolesGuard } from './roles.guard'; // Importa el Guard de roles
import { Roles } from './roles.decorator'; // Importa el decorador de roles

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(RolesGuard) // Usa el Guard de roles
  @Roles('admin') // Solo los administradores pueden acceder
  @Post('admin-only')
  adminOnlyRoute() {
    return { message: 'Esta ruta es solo para administradores' };
  }
}