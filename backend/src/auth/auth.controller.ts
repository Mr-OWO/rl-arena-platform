import { Controller, Post, Body } from '@nestjs/common';
import { AuthService, UserSession } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }): Promise<UserSession> {
    return this.authService.validateUser(body.username, body.password);
  }
}
