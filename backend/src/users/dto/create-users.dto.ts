import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsOptional, isString, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  uid: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  pass: string;

  @IsString()
  passConfirm: string;

  @IsString()
  @IsEmail()
  userEmail: String;

  @IsOptional()
  @IsDateString()
  birthDay: string;

  @IsBoolean()
  isMale: boolean;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  profilePic?: string;

  @IsOptional()
  @IsString()
  phoneNum?: string;

  @IsString()
  @Length(1,10)
  role: string;
}