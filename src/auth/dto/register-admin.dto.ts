import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterAdminDto {
    @IsEmail({}, { message: 'Email is invalid' })
    email: string;

    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty({ message: 'Secret Key is required' })
    secretKey: string;

    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}
