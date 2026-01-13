import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional, Min, MinLength } from 'class-validator';

export class CreateMenuItemDto {
    @IsString({ message: 'Title must be a string' })
    @IsNotEmpty({ message: 'Title is required' })
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    title: string;

    @IsString({ message: 'Description must be a string' })
    @IsNotEmpty({ message: 'Description is required' })
    @MinLength(10, { message: 'Description must be at least 10 characters long' })
    description: string;

    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price cannot be negative' })
    price: number;

    @IsString({ message: 'Category must be a string' })
    @IsNotEmpty({ message: 'Category is required' })
    category: string;

    @IsBoolean({ message: 'isAvailable must be a boolean' })
    @IsOptional()
    isAvailable?: boolean;
}

export class UpdateMenuItemDto {
    @IsString({ message: 'Title must be a string' })
    @IsOptional()
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    title?: string;

    @IsString({ message: 'Description must be a string' })
    @IsOptional()
    @MinLength(10, { message: 'Description must be at least 10 characters long' })
    description?: string;

    @IsNumber({}, { message: 'Price must be a number' })
    @IsOptional()
    @Min(0, { message: 'Price cannot be negative' })
    price?: number;

    @IsString({ message: 'Category must be a string' })
    @IsOptional()
    category?: string;

    @IsBoolean({ message: 'isAvailable must be a boolean' })
    @IsOptional()
    isAvailable?: boolean;
}
