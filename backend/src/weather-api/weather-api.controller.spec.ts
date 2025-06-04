import { Test, TestingModule } from '@nestjs/testing';
import { WeatherApiController } from './weather-api.controller';
import { WeatherApiService } from './weather-api.service';
import { GetWeatherDto } from './dto/get-weather.dto';

describe('WeatherApiController', () => {
  let controller: WeatherApiController;
  let weatherApiService: WeatherApiService;

  const mockWeatherData = {
    temperature: 22,
    condition: 'sunny',
    humidity: 60,
    windSpeed: 5,
  };

  const mockWeatherApiService = {
    getWeather: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherApiController],
      providers: [
        {
          provide: WeatherApiService,
          useValue: mockWeatherApiService,
        },
      ],
    }).compile();

    controller = module.get<WeatherApiController>(WeatherApiController);
    weatherApiService = module.get<WeatherApiService>(WeatherApiService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return weather data for given coordinates and time', async () => {
      const getWeatherDto: GetWeatherDto = {
        lat: 52.5200,
        lon: 13.4050,
        dt: '2025-06-01',
        hour: 14,
      };

      mockWeatherApiService.getWeather.mockResolvedValue(mockWeatherData);

      const result = await controller.getWeather(getWeatherDto);

      expect(result).toEqual(mockWeatherData);
      expect(mockWeatherApiService.getWeather).toHaveBeenCalledWith(getWeatherDto);
    });

    it('should handle weather service errors', async () => {
      const getWeatherDto: GetWeatherDto = {
        lat: 52.5200,
        lon: 13.4050,
        dt: '2025-06-01',
        hour: 14,
      };

      mockWeatherApiService.getWeather.mockRejectedValue(new Error('Weather API unavailable'));

      await expect(controller.getWeather(getWeatherDto)).rejects.toThrow('Weather API unavailable');
      expect(mockWeatherApiService.getWeather).toHaveBeenCalledWith(getWeatherDto);
    });

    it('should handle invalid coordinates', async () => {
      const invalidDto: GetWeatherDto = {
        lat: 999,
        lon: 999,
        dt: '2025-06-01',
        hour: 14,
      };

      mockWeatherApiService.getWeather.mockRejectedValue(new Error('Invalid coordinates'));

      await expect(controller.getWeather(invalidDto)).rejects.toThrow('Invalid coordinates');
    });
  });
});
