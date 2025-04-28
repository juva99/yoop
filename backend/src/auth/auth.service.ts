import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/users.entity';
import { hash, verify } from 'argon2';
import { CreateUserDto } from 'src/users/dto/create-users.dto';
import { UsersService } from 'src/users/users.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { tokens } from './types/tokens'
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { authenticatedUser } from './types/authenticatedUser';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.userEmail,
    );
    if (existingUser) {
      throw new ConflictException('User with this email is already registered');
    }
    return this.usersService.create(createUserDto);
  }

  async validateLocalUser(email, password): Promise<{ uid: string; name: string }> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('פרטי ההתחברות שגויים');
      }

      const isPasswordMatched = await verify(user.pass, password);

      if (!isPasswordMatched) {
        throw new UnauthorizedException('פרטי ההתחברות שגויים');
      }

      return {
        uid: user.uid,
        name: user.firstName + ' ' + user.lastName,
      };
    } catch (error) {
      console.error('Auth error:', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('אירעה שגיאה, אנא נסה שוב מאוחר יותר');
    }
  }

  async login(userId: string, name?: string): Promise<authenticatedUser> {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await hash(refreshToken);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
    return {
      uid: userId,
      name: name,
      accessToken,
      refreshToken
    };
  }

  async generateTokens(userId: string): Promise<tokens> {
    const payload: AuthJwtPayload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  async validateJwtUser(userId: string): Promise<{ uid: string }> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('המשתמש לא נמצא!');
    }

    const currentUser = { uid: user.uid };
    return currentUser;
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<{ uid: string }> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('המשתמש לא נמצא!');
    }

    if (!user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token or user not logged in')
    }

    const refreshTokenMatched = await verify(user.hashedRefreshToken, refreshToken)
    if (!refreshTokenMatched) { 
      throw new UnauthorizedException('Invalid Refresh Token!');
    }

    const currentUser = { uid: user.uid };
    return currentUser;
  }

  async refreshToken(userId: string, name?: string): Promise<authenticatedUser> {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await hash(refreshToken);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
    return {
      uid: userId,
      name: name,
      accessToken,
      refreshToken
    };
  }

  async signOut(uid: string): Promise<void> {
    return await this.usersService.updateRefreshToken(uid, "null");
  }
}
