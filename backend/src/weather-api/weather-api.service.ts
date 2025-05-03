import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherApiService {
    constructor(private readonly httpService: HttpService) {}

    async getWeather(city: string): Promise<any> {
        const response = await firstValueFrom(
          this.httpService.get(`https://api.weatherapi.com/v1/current.json`, {
            params: {
              key: `${process.env.WEATHER_KEY}`,
              q: city,
            },
          }),
        );
        return response.data;
      }
}
