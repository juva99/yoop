import { Test, TestingModule } from '@nestjs/testing';
import { FieldFetchApiController } from './field-fetch-api.controller';
import { FieldFetchApiService } from './field-fetch-api.service';

describe('FieldFetchApiController', () => {
  let controller: FieldFetchApiController;
  let fieldFetchApiService: FieldFetchApiService;

  const mockFieldsData = [
    {
      id: 'external-field-1',
      name: 'Municipal Sports Center',
      address: '123 Sports Ave, Berlin',
      latitude: 52.52,
      longitude: 13.405,
      type: 'Football',
      amenities: ['Parking', 'Changing Rooms', 'Lighting'],
    },
    {
      id: 'external-field-2',
      name: 'Community Recreation Field',
      address: '456 Recreation Blvd, Munich',
      latitude: 48.1351,
      longitude: 11.582,
      type: 'Multi-purpose',
      amenities: ['Parking', 'Restrooms'],
    },
  ];

  const mockFieldFetchApiService = {
    getFields: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldFetchApiController],
      providers: [
        {
          provide: FieldFetchApiService,
          useValue: mockFieldFetchApiService,
        },
      ],
    }).compile();

    controller = module.get<FieldFetchApiController>(FieldFetchApiController);
    fieldFetchApiService =
      module.get<FieldFetchApiService>(FieldFetchApiService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFields', () => {
    it('should return fields from external API', async () => {
      mockFieldFetchApiService.getFields.mockResolvedValue(mockFieldsData);

      const result = await controller.getFields();

      expect(result).toEqual(mockFieldsData);
      expect(mockFieldFetchApiService.getFields).toHaveBeenCalled();
    });

    it('should return empty array when no external fields available', async () => {
      mockFieldFetchApiService.getFields.mockResolvedValue([]);

      const result = await controller.getFields();

      expect(result).toEqual([]);
      expect(mockFieldFetchApiService.getFields).toHaveBeenCalled();
    });

    it('should handle external API errors', async () => {
      mockFieldFetchApiService.getFields.mockRejectedValue(
        new Error('External API unavailable'),
      );

      await expect(controller.getFields()).rejects.toThrow(
        'External API unavailable',
      );
      expect(mockFieldFetchApiService.getFields).toHaveBeenCalled();
    });

    it('should handle network timeout errors', async () => {
      mockFieldFetchApiService.getFields.mockRejectedValue(
        new Error('Request timeout'),
      );

      await expect(controller.getFields()).rejects.toThrow('Request timeout');
      expect(mockFieldFetchApiService.getFields).toHaveBeenCalled();
    });

    it('should handle malformed API response', async () => {
      mockFieldFetchApiService.getFields.mockRejectedValue(
        new Error('Invalid response format'),
      );

      await expect(controller.getFields()).rejects.toThrow(
        'Invalid response format',
      );
      expect(mockFieldFetchApiService.getFields).toHaveBeenCalled();
    });
  });
});
