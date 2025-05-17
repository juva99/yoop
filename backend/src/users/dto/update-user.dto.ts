import {
  IsString,
  IsEmail,
  Matches,
  Length,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { City } from 'src/enums/city.enum'; // עדכן אם הנתיב שונה

export class UpdateUserDto {
  @IsString()
  @Length(2)
  @Matches(/^[א-ת]+$/, {
    message: 'שם פרטי חייב להכיל אותיות בעברית בלבד',
  })
  firstName: string;

  @IsString()
  @Length(2)
  @Matches(/^[א-ת]+$/, {
    message: 'שם משפחה חייב להכיל אותיות בעברית בלבד',
  })
  lastName: string;

  @IsString()
  @IsEmail({}, { message: 'כתובת מייל לא תקינה' })
  userEmail: string;

  @IsString()
  @Matches(/^(\+972|0)5\d(-?\d{7})$/, {
    message:
      'מספר הטלפון חייב להיות באחד הפורמטים: 05X-1234567 , 05X1234567 , +9725X-1234567 , +9725X1234567',
  })
  @Transform(({ value }) => {
    const cleaned = value.replace(/-/g, '');
    return cleaned.startsWith('+972') ? '0' + cleaned.slice(4) : cleaned;
  })
  phoneNum: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'יש להזין תאריך בפורמט YYYY-MM-DD',
  })
  @IsDateString({}, { message: 'תאריך הלידה חייב להיות תקין' })
  birthDay: string;

  @IsEnum(City, { message: 'יש לבחור יישוב מהרשימה' })
  address: City;
}
