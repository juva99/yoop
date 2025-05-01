import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      if (createUserDto.pass != createUserDto.passConfirm) {
        throw new HttpException(
          'Conifrm pass is not equal to password',
          HttpStatus.BAD_REQUEST,
        );
      }
      const { pass, ...user } = this.userRepository.create(createUserDto);
      const hashedPass = await hash(pass);
      return await this.userRepository.save({
        pass: hashedPass,
        ...user,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteOne(uid: string): Promise<void> {
    const results = await this.userRepository.delete(uid);
    if (results.affected === 0) {
      throw new NotFoundException(`user with id ${uid} not found`);
    }
  }

  async findById(uid: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { uid } });
    if (!user) {
      throw new NotFoundException(`User with id ${uid} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.createQueryBuilder('user').addSelect(['user.pass', 'user.hashedRefreshToken']).where('user.userEmail = :email', {email}).getOne();
    // .findOne({
    //   where: { userEmail: email },
    // });
  }

  // test if it works without null
  async updateRefreshToken(
    uid: string,
    hashedRefreshToken: string,
  ): Promise<void> {
    await this.userRepository.update(
      { uid },
      { hashedRefreshToken: hashedRefreshToken },
    );
  }
}
