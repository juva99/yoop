import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { GameType } from 'src/enums/game-type.enum';

export class UpdateGroupDto {
  @IsUUID('4')
  groupId: string;

  @IsOptional()
  @IsString()
  groupName?: string;

  @IsOptional()
  @IsString()
  groupPicture?: string;

  @IsOptional()
  @IsEnum(GameType, { each: true })
  gameTypes?: GameType[];
}
