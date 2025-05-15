import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendSetStatusDto } from './dto/friendsSetStatus.dto';
import { FriendReqDto } from './dto/friendsReq.dto';
import { FriendRelation } from './friends.entity';
import { FriendsService } from './friends.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/users.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Patch('/set-status')
  async setStatus(
    @Body() setStatusDto: FriendSetStatusDto,
    @GetUser() user: User,
  ): Promise<FriendRelation> {
    await this.friendsService.checkUser(user, setStatusDto.req_uid);
    return await this.friendsService.setStatus(setStatusDto);
  }
  
  @Post('/send-req')
  async sendReq(
    @Body() friendReqDto: FriendReqDto,
    @GetUser() user: User,
  ): Promise<FriendRelation> {
    return await this.friendsService.sendReq(friendReqDto, user);
  }

  @Delete('/delete-req')
  async deleteReq(@GetUser() user: User, @Param('id') id: string) {
    await this.friendsService.checkUser(user, id);
    return await this.friendsService.deleteReq(id);
  }

  @Get('/pending-req')
  async getPendingRequests(@GetUser() user: User) {
    return this.friendsService.getPendingRequestsForUser(user);
  }

  @Get('/getAll')
  async getAllFriends(@GetUser() user: User) {
    return this.friendsService.getAllFriends(user);
  }
}
