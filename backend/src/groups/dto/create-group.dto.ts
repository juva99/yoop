import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { GameType } from 'src/enums/game-type.enum';

export class CreateGroupDto {
  @IsString()
  groupName: string;

  @IsOptional()
  @IsString()
  groupPicture?: string;

  @IsEnum(GameType, { each: true })
  gameTypes: GameType[];

  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
}
