import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString, IsUrl, IsBoolean, Min } from 'class-validator';

@Entity('menu_items')
export class MenuItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    @IsNumber()
    @Min(0)
    price: number;

    @Column()
    @IsUrl()
    @IsNotEmpty()
    imageUrl: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    category: string; // 'Starters', 'Main Courses', 'Desserts'

    @Column({ default: true })
    @IsBoolean()
    isAvailable: boolean;
}
