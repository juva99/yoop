import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { AuthService } from '../auth.service';
import refreshConfig from '../config/refresh.config';
import { Request } from 'express';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
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
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: AuthJwtPayload,
  ): Promise<{ uid: string; role: Role; name?: string }> {
    const userId = payload.sub;
    const refreshToken = req.body.refresh;

    return await this.authService.validateRefreshToken(userId, refreshToken);
  }
}
