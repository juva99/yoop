import { Injectable, NotFoundException } from '@nestjs/common';
import { FriendSetStatusDto } from './dto/friendsSetStatus.dto';
import { FriendRelation } from './friends.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendReqDto } from './dto/friendsReq.dto';
import { User } from 'src/users/users.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRelation)
    private friendRepository: Repository<FriendRelation>,
    private userRepository: Repository<User>,
  ) {}
  async setStatus(setStatusDto: FriendSetStatusDto): Promise<FriendRelation> {
    const { req_uid, status } = setStatusDto;
    let reqStatus = await this.friendRepository.findOne({
      where: { id: req_uid },
    });
    if (!reqStatus) {
      throw new NotFoundException(
        `Friend request with id ${req_uid} not found`,
      );
    }
    reqStatus.status = status;
    return this.friendRepository.save(reqStatus);
  }

  async sendReq(
    friendReqDto: FriendReqDto,
    user: User,
  ): Promise<FriendRelation> {
    const friend = await this.userRepository.findOne({
      where: { uid: friendReqDto.user_uid },
    });
    if (!friend) {
      throw new NotFoundException(
        `User with id ${friendReqDto.user_uid} not found`,
      );
    }
    const request = this.friendRepository.create({
      user1: user,
      user2: friend,
    });
    return this.friendRepository.save(request);
  }
}
