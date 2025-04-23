import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { AuthJwtPayload } from "../types/auth-jwtPayload";
import { AuthService } from "../auth.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private authService: AuthService
  ) {
    if (!jwtConfiguration.secret) {
      throw new Error('JWT secret is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret,
      ignoreExpiration: false
    });
  }

  // added await and async. need to test if needed
  async validate(payload:AuthJwtPayload) {
    const userId = payload.sub;
    return await this.authService.validateJwtUser(userId);
  }
}
