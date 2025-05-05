import {
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsString,
  Length,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { City } from 'src/enums/cities.enum';
import { GameType } from 'src/enums/game-type.enum';
export class CreateFieldDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(GameType, { each: true })
  gameTypes: GameType[];

  @IsString()
  fieldName: string;

  @IsBoolean()
  isManaged: boolean;

  @IsOptional()
  @IsString()
  fieldPhoto?: string;

  @IsNumber()
  fieldLat: number;

  @IsNumber()
  fieldLng: number;

  @IsOptional()
  @IsString()
  fieldAddress?: string;

  @IsEnum(City)
  city: City;
}
