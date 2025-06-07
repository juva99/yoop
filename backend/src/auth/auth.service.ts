import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/users.entity';
import { CreateUserDto } from 'src/users/dto/create-users.dto';
import { UsersService } from 'src/users/users.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { tokens } from './types/tokens';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { authenticatedUser } from './types/authenticatedUser';
import { Role } from 'src/enums/role.enum';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { CreateManagerDto } from 'src/users/dto/create-manager.dto';
import { ManagerSignupService } from 'src/manager-signup/manager-signup.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly managerSignupService: ManagerSignupService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.userEmail = createUserDto.userEmail.toLowerCase();
    const existingUser = await this.usersService.findByEmail(
      createUserDto.userEmail,
    );
    if (existingUser) {
      throw new ConflictException('User with this email is already registered');
    }
    const user = await this.usersService.create(createUserDto);

    // await this.mailService.sendWelcomeEmail(user.userEmail, user.firstName);

    return user;
  }

  async validateLocalUser(
    email: string,
    password: string,
  ): Promise<{ uid: string; name: string; role: Role }> {
    email = email.toLowerCase();
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('פרטי ההתחברות שגויים');
      }

      const isPasswordMatched = await bcrypt.compare(password, user.pass);

      if (!isPasswordMatched) {
        throw new UnauthorizedException('פרטי ההתחברות שגויים');
      }

      return {
        uid: user.uid,
        name: user.firstName + ' ' + user.lastName,
        role: user.role,
      };
    } catch (error) {
      console.error('Auth error:', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('אירעה שגיאה, אנא נסה שוב מאוחר יותר');
    }
  }

  async login(
    userId: string,
    role: Role,
    name?: string,
  ): Promise<authenticatedUser> {
    const { accessToken, refreshToken } = await this.generateTokens(userId);

    //change
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
    return {
      uid: userId,
      name: name,
      role,
      accessToken,
      refreshToken,
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
      refreshToken,
    };
  }

  async validateJwtUser(userId: string): Promise<{ uid: string; role: Role }> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('המשתמש לא נמצא!');
    }

    const currentUser = { uid: user.uid, role: user.role };
    return currentUser;
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<{ uid: string; role: Role; name?: string }> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('המשתמש לא נמצא!');
    }
    if (!user.hashedRefreshToken) {
      throw new UnauthorizedException(
        'Invalid refresh token or user not logged in',
      );
    }
    const refreshTokenMatched = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!refreshTokenMatched) {
      throw new UnauthorizedException('Invalid Refresh Token!');
    }

    const currentUser = {
      uid: user.uid,
      role: user.role,
      name: user.firstName + ' ' + user.lastName,
    };
    return currentUser;
  }

  async refreshToken(
    userId: string,
    role: Role,
    name?: string,
  ): Promise<authenticatedUser> {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
    return {
      uid: userId,
      name: name,
      role,
      accessToken,
      refreshToken,
    };
  }

  async signOut(uid: string): Promise<void> {
    return await this.usersService.updateRefreshToken(uid, 'null');
  }

  async forgotPassword(email: string): Promise<any> {
    // get user based on posted email
    const user = await this.usersService.findByEmail(email.toLowerCase());
    if (!user) {
      throw new NotFoundException(`user with email address${email} not found`);
    }
    // generate random reset token
    const token = await this.usersService.createPasswordResetToken(user.uid, 1);

    this.mailService.sendPasswordReset(email, token, user.firstName);
  }

  //replace dto to contact-id
  async approveManager(managerSignupId: string): Promise<User> {
    // Get manager contact form by ID
    const managerSignup =
      await this.managerSignupService.findById(managerSignupId);
    //Set managerDto with details from contact signup form
    const createManagerDto: CreateManagerDto = {
      firstName: managerSignup.firstName,
      lastName: managerSignup.lastName,
      userEmail: managerSignup.email,
      phoneNum: managerSignup.phoneNum,
    };

    //try to create user by form, if cant throw error
    try {
      const manager = await this.usersService.createManager(createManagerDto);
      const token = await this.usersService.createPasswordResetToken(
        manager.uid,
        72,
      );
      //if succeeded delete signup form and return user
      await this.mailService.sendManagerInvite(
        manager.userEmail,
        token,
        manager.firstName + ' ' + manager.lastName,
      );
      await this.managerSignupService.delete(managerSignupId);
      return manager;
    } catch (error) {
      throw new BadRequestException(
        'Failed to approve manager: ' + error.message,
      );
    }
  }
}
