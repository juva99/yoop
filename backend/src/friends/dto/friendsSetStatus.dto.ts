import { IsEnum, IsString } from 'class-validator';
import { FriendReqStatus } from 'src/enums/friend-req-status.enum';

export class FriendSetStatusDto {
  @IsString()
  req_uid: string;

  @IsEnum(FriendReqStatus)
  status: FriendReqStatus;
}
