import { Injectable, NotFoundException } from '@nestjs/common';
import { FriendSetStatusDto } from './dto/friendsSetStatus.dto';
import { FriendReqStatus } from 'src/enums/friend-req-status.enum';
import { FriendRelation } from './friends.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendReqDto } from './dto/friendsReq.dto';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRelation)
    private friendRepository: Repository<FriendRelation>,
    private readonly userService: UsersService,
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

    if (status === FriendReqStatus.REJECTED) {
      return await this.friendRepository.remove(reqStatus);
    }
    reqStatus.status = status;
    return this.friendRepository.save(reqStatus);
  }

  async sendReq(
    friendReqDto: FriendReqDto,
    user: User,
  ): Promise<FriendRelation> {
    const friend = await this.userService.findById(friendReqDto.user_uid);

    const request = this.friendRepository.create({
      user1: user,
      user2: friend,
    });

    return this.friendRepository.save(request);
  }

  async deleteReq(id: string): Promise<void> {
    const req = await this.friendRepository.findOne({ where: { id } });
    if (!req) {
      throw new NotFoundException(`Friend request with id ${id} not found`);
    }
    await this.friendRepository.remove(req);
  }

  async checkUser(user: User, relationId: string): Promise<Boolean> {
    const relations = await this.friendRepository.find({
      where: [
        { user1: user, id: relationId },
        { user2: user, id: relationId },
      ],
    });
    if (!relations || relations.length === 0) {
      throw new NotFoundException(
        `No friend relations found for user with id ${user.uid} and relation id ${relationId}`,
      );
    }
    return true;
  }

  async getPendingRequestsForUser(user: User): Promise<FriendRelation[]> {
    return this.friendRepository.find({
      where: {
        user2: { uid: user.uid },
        status: FriendReqStatus.PENDING,
      },
      relations: ['user1'],
    });
  }
  async getAllFriends(user: User): Promise<FriendRelation[]> {
    return this.friendRepository.find({
      where: [
        {
          user1: { uid: user.uid },
          status: FriendReqStatus.APPROVED,
        },
        {
          user2: { uid: user.uid },
          status: FriendReqStatus.APPROVED,
        },
      ],
      relations: ['user1', 'user2'],
    });
  }
}
