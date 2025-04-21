import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  uid: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @Length(8)
  pass: string;

  @IsString()
  @Length(8)
  passConfirm: string;

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
