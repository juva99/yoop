import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateManagerDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  userEmail: string;

  @IsString()
  @Matches(/^(\+972|0)5\d(-?\d{7})$/, {
    message: 'is not valid phone number',
  })
  phoneNum: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  profilePic?: string;

}
