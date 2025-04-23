import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'argon2';
import { CreateUserDto } from 'src/users/dto/create-users.dto';
import { UsersService } from 'src/users/users.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.userEmail,
    );
    if (existingUser) {
      throw new ConflictException('User with this email is already registered');
    }
    return this.usersService.create(createUserDto);
  }


  async validateLocalUser(email, password) {
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
      }   

    } catch (error) {
      console.error('Auth error:', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      } 
      throw new UnauthorizedException('אירעה שגיאה, אנא נסה שוב מאוחר יותר');
    }
  }


  async login(userId: string, name?: string) {
    const { accessToken } = await this.generateTokens(userId);
    return {
      uid: userId,
      name: name,
      accessToken
    }
  }


  async generateTokens(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(payload)])
    
    return {
      accessToken
    }
  }

  async validateJwtUser(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException("המשתמש לא נמצא!");
    }

    const currentUser = { uid: user.uid };

    return currentUser;
  }
}

