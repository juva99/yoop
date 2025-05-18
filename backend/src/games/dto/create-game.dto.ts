import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GameType } from 'src/enums/game-type.enum';

export class CreateGameDto {
  @IsEnum(GameType, { each: true })
  gameType: GameType;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsNumber()
  maxParticipants: number;

  @IsString()
  field: string;

  @IsOptional()
  price?: number;
}
