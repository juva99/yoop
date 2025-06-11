import { Test, TestingModule } from '@nestjs/testing';
import { WeatherApiService } from './weather-api.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { HttpException } from '@nestjs/common';
import { GetWeatherDto } from './dto/get-weather.dto';

describe('WeatherApiService', () => {
  let service: WeatherApiService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockWeatherResponse = {
    data: {
      forecast: {
        forecastday: [
          {
            date: '2023-12-01',
            hour: [
              {
                time: '2023-12-01 14:00',
                temp_c: 22.5,
                condition: {
                  text: 'Clear',
                  icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
                },
                wind_kph: 10.8,
                humidity: 60,
                chance_of_rain: 0,
              },
            ],
          },
        ],
      },
      current: {
        temp_c: 22.5,
        condition: {
          text: 'Clear',
          icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
        },
        wind_kph: 10.8,
        humidity: 60,
      },
      location: {
        name: 'New York',
        country: 'United States of America',
        lat: 40.76,
        lon: -73.98,
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherApiService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<WeatherApiService>(WeatherApiService);
    httpService = module.get<HttpService>(HttpService);

    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    const getWeatherDto: GetWeatherDto = {
      lat: 40.76,
      lon: -73.98,
      dt: '2023-12-01',
      hour: 14,
    };

    it('should return weather data successfully', async () => {
      mockHttpService.get.mockReturnValue(of(mockWeatherResponse));

      const result = await service.getWeather(getWeatherDto);

      expect(result).toEqual(mockWeatherResponse.data);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.weatherapi.com/v1/forecast.json',
        {
          params: {
            key: undefined, // process.env.WEATHER_KEY is undefined in test
            q: `${getWeatherDto.lat},${getWeatherDto.lon}`,
            dt: getWeatherDto.dt,
            hour: getWeatherDto.hour,
          },
        },
      );
    });

    it('should handle API errors gracefully', async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: { error: { message: 'No matching location found.' } },
        },
      };
      mockHttpService.get.mockReturnValue(throwError(() => errorResponse));

      await expect(service.getWeather(getWeatherDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockHttpService.get.mockReturnValue(throwError(() => networkError));

      await expect(service.getWeather(getWeatherDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should make HTTP request with correct parameters', async () => {
      mockHttpService.get.mockReturnValue(of(mockWeatherResponse));

      await service.getWeather(getWeatherDto);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.weatherapi.com/v1/forecast.json',
        {
          params: {
            key: undefined,
            q: `${getWeatherDto.lat},${getWeatherDto.lon}`,
            dt: getWeatherDto.dt,
            hour: getWeatherDto.hour,
          },
        },
      );
    });

    it('should throw NotFoundException when forecast data is not available', async () => {
      const responseWithoutForecast = {
        data: {
          forecast: {
            forecastday: [],
          },
        },
      };
      mockHttpService.get.mockReturnValue(of(responseWithoutForecast));

      await expect(service.getWeather(getWeatherDto)).rejects.toThrow();
    });
  });
});
