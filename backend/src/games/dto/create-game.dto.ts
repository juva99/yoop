import { IsBoolean, IsDate, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, isString, IsString, Length } from 'class-validator';

export class CreateGameDto {
 
  @IsNumber()
  gameType: number;

  @IsString()
  fieldId: string;

  @IsString()
  mid: string;

  @IsDate()
  date: Date;

  @IsNumber()
  maxParticipants: number;

}