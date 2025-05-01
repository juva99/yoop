import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches
} from 'class-validator';

export class CreateUserDto {
  
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @Length(8,36)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  message: 'Password must contain an uppercase, a lowercase and number or special character',})
  pass: string;

  @IsString()
  @Length(8)
  passConfirm: string;

  @IsString()
  @IsEmail()
  userEmail: string;

  @IsOptional()
  @IsDateString()
  birthDay?: string;

  @IsOptional()
  @IsBoolean()
  isMale?: boolean;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  profilePic?: string;

  @IsOptional()
  @IsString()
  phoneNum?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  role?: string;
}
