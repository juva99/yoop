import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { GameType } from 'src/enums/game-type.enum';

export class QueryGameDto {
  @IsOptional()
  @IsEnum(GameType)
  gameType?: GameType;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsString()
  city?: string;
}
