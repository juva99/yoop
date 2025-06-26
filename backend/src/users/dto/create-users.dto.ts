import {
  IsDateString,
  IsEmail,
  IsEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @Length(8, 36)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain an uppercase, a lowercase and number or special character',
  })
  pass: string;

  @IsString()
  @Length(8)
  passConfirm: string;

  @IsString()
  @IsEmail()
  userEmail: string;

  @IsDateString()
  birthDay?: string;

  @IsString()
  address?: string;

  @IsString()
  @Matches(/^(\+972|0)5\d(-?\d{7})$/, {
    message: 'is not valid phone number',
  })
  phoneNum?: string;

  @IsEmpty()
  role: Role;
}
