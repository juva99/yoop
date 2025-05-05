import { IsNumber, IsString } from 'class-validator';
export class GetWeatherDto {
    @IsNumber()
    lat: number;

    @IsNumber()
    lon: number;
  
     @IsString()
     dt: string;

    @IsString()  
     hour: number;
}