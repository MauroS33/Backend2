import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: any) {
    const payload = { username: user.username, sub: user._id, role: user.role }; // Incluye el rol
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}