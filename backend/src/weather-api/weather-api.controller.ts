import { Controller, Get, Param } from '@nestjs/common';
import { WeatherApiService } from './weather-api.service';
import { GetWeatherDto } from './dto/get-weather.dto';

@Controller('weather-api')
export class WeatherApiController {
    constructor(private readonly weatherApiService: WeatherApiService) {}

    @Get('/:city/:dt/:hour')
    async getWeather(@Param() getWeatherDto: GetWeatherDto) {
        return await this.weatherApiService.getWeather(getWeatherDto);
      }
}
