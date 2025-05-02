import {
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';
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

  @IsOptional()
  @IsString()
  fieldlat?: string;

  @IsOptional()
  @IsString()
  fieldlng?: string;

  @IsOptional()
  @IsString()
  fieldAddress?: string;

  @IsString()
  city: string;
}
