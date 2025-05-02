import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isString,
  IsString,
  Length,
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
}
