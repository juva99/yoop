import { convertXYService } from './convertXY.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('convertXYService', () => {
  let service: convertXYService;

  beforeEach(() => {
    service = new convertXYService();
  });

  describe('convertXYtoLatLon', () => {
    it('should return [lat, lon] for valid ITM coordinates', () => {
      // Example ITM coordinates of Jerusalem
      const x = 219529;
      const y = 626907;

      const [lat, lon] = service.convertXYtoLatLon(x, y);

      // Check they are numbers and fall within reasonable range for Israel
      expect(typeof lat).toBe('number');
      expect(typeof lon).toBe('number');
      expect(lat).toBeGreaterThan(29); // South of Israel ~29°
      expect(lat).toBeLessThan(34); // North of Israel ~33.5°
      expect(lon).toBeGreaterThan(33); // West ~33°
      expect(lon).toBeLessThan(36); // East ~35.5°
    });

    it('should throw InternalServerErrorException if x or y is NaN', () => {
      expect(() => service.convertXYtoLatLon(NaN, 123456)).toThrow(
        InternalServerErrorException,
      );
      expect(() => service.convertXYtoLatLon(123456, NaN)).toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException if x or y is undefined', () => {
      expect(() => service.convertXYtoLatLon(undefined as any, 123456)).toThrow(
        InternalServerErrorException,
      );
      expect(() => service.convertXYtoLatLon(123456, undefined as any)).toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException if x or y is null', () => {
      expect(() => service.convertXYtoLatLon(null as any, 123456)).toThrow(
        InternalServerErrorException,
      );
      expect(() => service.convertXYtoLatLon(123456, null as any)).toThrow(
        InternalServerErrorException,
      );
    });
  });
});
