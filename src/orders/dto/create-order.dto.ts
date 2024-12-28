import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    specifications: string;

    @IsNotEmpty()
    @IsInt()
    quantity: number;

    @IsNotEmpty()
    @IsInt()
    userId: number;


    metadata: object;
}