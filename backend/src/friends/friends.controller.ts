import { Body, Controller, Patch, Post } from '@nestjs/common';
import { FriendSetStatusDto } from './dto/friendsSetStatus.dto';
import { FriendReqDto } from './dto/friendsReq.dto';
import { FriendRelation } from './friends.entity';
import { FriendsService } from './friends.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/users.entity';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Patch('/set-status')
  async setStatus(
    @Body() setStatusDto: FriendSetStatusDto,
  ): Promise<FriendRelation> {
    return await this.friendsService.setStatus(setStatusDto);
  }

  @Post('/send-req')
  async sendReq(
    @Body() friendReqDto: FriendReqDto,
    @GetUser() user: User,
  ): Promise<FriendRelation> {
    return await this.friendsService.sendReq(friendReqDto, user);
  }
}
