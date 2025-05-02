import { IsDateString, IsNotEmpty } from 'class-validator';

export class QueryAvailableSlotsDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
