import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GetWeatherDto } from './dto/get-weather.dto';


@Injectable()
export class WeatherApiService {
    constructor(private readonly httpService: HttpService) {}

    async getWeather(getWeatherDto: GetWeatherDto): Promise<any> {
        const response = await firstValueFrom(
          this.httpService.get(`https://api.weatherapi.com/v1/forecast.json`, {
            params: {
              key: `${process.env.WEATHER_KEY}`,
              q: `${getWeatherDto.lat},${getWeatherDto.lon}`,
              dt: getWeatherDto.dt,
              hour: getWeatherDto.hour
            },
          }),
        );
        if(response.data.forecast.forecastday[0]){
        const parsedData = {"condition": response.data.forecast.forecastday[0].hour[0].condition, "temp_c": response.data.forecast.forecastday[0].hour[0].temp_c};
        return parsedData;
        }
        else {
          throw new NotFoundException('Invalid response from weather API');
        }
      }
}
