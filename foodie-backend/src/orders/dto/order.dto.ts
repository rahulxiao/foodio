import { IsNotEmpty, IsNumber, IsString, IsArray, ArrayMinSize, ValidateNested, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @IsNumber({}, { message: 'Menu item ID must be a number' })
    @IsNotEmpty({ message: 'Menu item ID is required' })
    menuItemId: number;

    @IsNumber({}, { message: 'Quantity must be a number' })
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity: number;

    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price cannot be negative' })
    price: number;
}

export class CreateOrderDto {
    @IsArray({ message: 'Items must be an array' })
    @ArrayMinSize(1, { message: 'Order must have at least one item' })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsNumber({}, { message: 'Total must be a number' })
    @Min(0, { message: 'Total cannot be negative' })
    total: number;

    @IsString({ message: 'Address must be a string' })
    @IsOptional()
    address?: string;
}

export class UpdateOrderStatusDto {
    @IsString({ message: 'Status must be a string' })
    @IsNotEmpty({ message: 'Status is required' })
    status: string;
}
