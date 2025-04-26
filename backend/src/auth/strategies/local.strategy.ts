import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'userEmail',
      passwordField: 'pass',
    });
  }

  async validate(userEmail: string, pass: string) {
    return await this.authService.validateLocalUser(userEmail, pass);
  }
}
