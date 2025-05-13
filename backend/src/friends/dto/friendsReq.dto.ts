import { IsString } from 'class-validator';

export class FriendReqDto {
  @IsString()
  user_uid: string;
}
