import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { AuthService } from '../auth.service';
import refreshConfig from '../config/refresh.config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy,"refresh-jwt") {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshTokenCongif: ConfigType<typeof refreshConfig>,
    private authService: AuthService,
  ) {
    if (!refreshTokenCongif.secret) {
      throw new Error('Refresh JWT secret is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      secretOrKey: refreshTokenCongif.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: AuthJwtPayload) {
    const userId = payload.sub;
    return await this.authService.validateRefreshToken(userId);
  }
}
