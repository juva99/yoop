import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, MoreThan } from 'typeorm';
import { hash } from 'argon2';
import { FriendRelation } from 'src/friends/friends.entity';
import * as crypto from 'crypto';

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
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect(['user.pass', 'user.hashedRefreshToken'])
      .where('user.userEmail = :email', { email })
      .getOne();
  }

  async findByName(name: string, currentUser: User): Promise<User[]> {
    // look up for new friends by first and last name
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Search by first name or last name
    queryBuilder.where(
      '(user.firstName ILIKE :name OR user.lastName ILIKE :name)',
      { name: `%${name}%` },
    );

    // Exclude the current user
    queryBuilder.andWhere('user.uid != :currentUserId', {
      currentUserId: currentUser.uid,
    });

    // Subquery to get IDs of friends
    // Friends are users who have an accepted friend request with the current user
    const subQuery = this.userRepository
      .createQueryBuilder()
      .subQuery()
      .select(
        'CASE WHEN fr.user1Uid = :currentUserId THEN fr.user2Uid ELSE fr.user1Uid END',
      )
      .from(FriendRelation, 'fr')
      .where('(fr.user1Uid = :currentUserId OR fr.user2Uid = :currentUserId)');

    // Exclude friends from the result
    queryBuilder.andWhere('user.uid NOT IN (' + subQuery.getQuery() + ')');

    // Set parameters for the subquery (TypeORM requires them on the main query builder)
    queryBuilder.setParameter('currentUserId', currentUser.uid);

    return await queryBuilder.getMany();
  }

  // test if it works without null
  async updateRefreshToken(
    uid: string,
    hashedRefreshToken: string,
  ): Promise<void> {
    await this.userRepository.update(
      { uid },
      { hashedRefreshToken },
    );
  }

  async updateUser(id: string, updatedFields: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ uid: id });

    if (!user) throw new Error('User not found');

    Object.assign(user, updatedFields);
    return await this.userRepository.save(user);
  }

  async createPasswordResetToken(uid: string): Promise<any>{
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

        await this.userRepository.update({uid}, 
          { 
            passwordResetToken,
            passwordResetExpires,
          }
        );

        return resetToken;
  }

  async changePassword(token: string, newPassword: string): Promise<void>{
    //get user based on token
    const hashedtoken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: hashedtoken,
        passwordResetExpires: MoreThan(new Date()),
      }
    });

    //if found and token isnt expired set new password and delete refreshtoken
    if(!user){
      throw new NotFoundException(`password reset token isn't valid`);
    }
    const hashedPass = await hash(newPassword)
    
    const updateduser = await this.userRepository.update(user.uid,
      {
        pass: hashedPass,
        passwordResetToken: null,
        hashedRefreshToken: null,
      }
    );
    
    //log user in
  }
}
