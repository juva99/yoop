import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, isString, IsString, Length } from 'class-validator';

export class CreateFieldDto {
 
    @IsNumber()
    gametype: number;
   
    @IsBoolean()
    isManaged: boolean;
 
    @IsString()
    fieldPhoto?: string;
 
    @IsString()
    fieldlat?: string;
 
    @IsString()
    fieldlng?: string;
 
    @IsString()
    fieldAddress?: string;
   
    @IsString()
    city: string;

}