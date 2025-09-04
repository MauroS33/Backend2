import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (user?.role !== 'admin') {
      throw new UnauthorizedException('Solo admins pueden acceder');
    }
    return user;
  }
}