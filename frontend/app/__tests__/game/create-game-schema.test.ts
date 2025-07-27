import { FormDataSchema } from '@/lib/schemas/create_game_schema';
import { City } from '@/app/enums/city.enum';
import { GameType } from '@/app/enums/game-type.enum';

describe('Create Game Schema Validation', () => {
  const validData = {
    date: new Date('2025-12-31'),
    gameType: GameType.FootBall,
    city: City.JERUSALEM,
    maxParticipants: 10,
    fieldName: 'מגרש המרכז',
    startTime: '10:00',
    endTime: '12:00'
  };

  describe('Valid data', () => {
    it('should pass validation with valid data', () => {
      const result = FormDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept basketball game type', () => {
      const data = { ...validData, gameType: GameType.BasketBall };
      const result = FormDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept different cities', () => {
      const data = { ...validData, city: City.TEL_AVIV_YAFO };
      const result = FormDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should convert string date to Date object', () => {
      const data = { ...validData, date: '2025-12-31' };
      const result = FormDataSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.date).toBeInstanceOf(Date);
      }
    });

    it('should convert string maxParticipants to number', () => {
      const data = { ...validData, maxParticipants: '8' };
      const result = FormDataSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.maxParticipants).toBe('number');
        expect(result.data.maxParticipants).toBe(8);
      }
    });
  });

  describe('Date validation', () => {
    it('should reject past dates', () => {
      const pastDate = new Date('2020-01-01');
      const data = { ...validData, date: pastDate };
      const result = FormDataSchema.safeParse(data);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('תאריך לא יכול להיות בעבר');
      }
    });

    it('should accept today\'s date', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const data = { ...validData, date: today };
      const result = FormDataSchema.safeParse(data);
      
      expect(result.success).toBe(true);
    });

    it('should accept future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const data = { ...validData, date: futureDate };
      const result = FormDataSchema.safeParse(data);
      
      expect(result.success).toBe(true);
    });
  });

  describe('MaxParticipants validation', () => {
    it('should reject less than 2 participants', () => {
      const data = { ...validData, maxParticipants: 1 };
      const result = FormDataSchema.safeParse(data);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('לפחות 2 משתתפים');
      }
    });

    it('should accept exactly 2 participants', () => {
      const data = { ...validData, maxParticipants: 2 };
      const result = FormDataSchema.safeParse(data);
      
      expect(result.success).toBe(true);
    });

    it('should accept more than 2 participants', () => {
      const data = { ...validData, maxParticipants: 20 };
      const result = FormDataSchema.safeParse(data);
      
      expect(result.success).toBe(true);
    });
  });

  describe('Required fields validation', () => {
    it('should require fieldName', () => {
      const data = { ...validData, fieldName: '' };
      const result = FormDataSchema.safeParse(data);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('בחר מגרש');
      }
    });

    it('should require startTime', () => {
      const data = { ...validData, startTime: '' };
      const result = FormDataSchema.safeParse(data);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('שעת התחלה נדרשת');
      }
    });

    it('should require endTime', () => {
      const data = { ...validData, endTime: '' };
      const result = FormDataSchema.safeParse(data);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('שעת סיום נדרשת');
      }
    });
  });

  describe('Enum validation', () => {
    it('should reject invalid game type', () => {
      const data = { ...validData, gameType: 'invalid' as any };
      const result = FormDataSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });

    it('should reject invalid city', () => {
      const data = { ...validData, city: 'invalid' as any };
      const result = FormDataSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });
  });

  describe('Missing fields', () => {
    it('should reject when required fields are missing', () => {
      const data = { date: validData.date };
      const result = FormDataSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });
  });
});
