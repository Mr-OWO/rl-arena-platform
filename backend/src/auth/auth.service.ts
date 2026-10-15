import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface UserSession {
  userId: string;
  username: string;
  role: 'annotator' | 'admin' | 'lead';
  token: string;
}

@Injectable()
export class AuthService {
  private users = [
    { id: 'u1', username: 'eval_lead', password: 'password123', role: 'lead' },
    { id: 'u2', username: 'annotator_1', password: 'password123', role: 'annotator' },
  ];

  async validateUser(username: string, pass: string): Promise<UserSession> {
    const user = this.users.find((u) => u.username === username && u.password === pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      userId: user.id,
      username: user.username,
      role: user.role as any,
      token: `mock-jwt-${user.id}-${Date.now()}`,
    };
  }
}
