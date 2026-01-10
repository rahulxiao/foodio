import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Column({ nullable: true })
    @IsString()
    address: string;

    @Column()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @Column({ default: 'user' })
    role: string; // 'admin' | 'user'

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
