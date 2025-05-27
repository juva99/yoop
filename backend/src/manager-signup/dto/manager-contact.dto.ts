import { IsEmail, IsString, Matches } from "class-validator";

export class ManagerContactDto{

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    message: string;

    @IsString()
    @Matches(/^(\+972|0)5\d(-?\d{7})$/, {
      message: 'is not valid phone number',
    })
    phoneNum: string;
}