import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('profile')
@UseGuards(RolesGuard) // Usa el Guard de roles
export class ProfileController {
  @Get()
  getProfile(@GetUser() user) {
    return { message: `Bienvenido, ${user.username} (${user.role})` };
  }
}