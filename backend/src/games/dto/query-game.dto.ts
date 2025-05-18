import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { City } from 'src/enums/city.enum';
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
  @IsEnum(City)
  city?: City;
}
