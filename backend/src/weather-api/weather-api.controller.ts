import { Controller, Get, Param } from '@nestjs/common';
import { WeatherApiService } from './weather-api.service';

@Controller('weather-api')
export class WeatherApiController {
    constructor(private readonly weatherApiService: WeatherApiService) {}

    @Get('/:city')
    async getWeather(@Param("city") city: string): Promise<any>{
        return this.weatherApiService.getWeather(city);
    }
}
