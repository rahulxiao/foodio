import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../users/entities/user.entity';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.orders, { nullable: true }) // Optional for guest checkout if needed
    user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[];

    @Column('decimal', { precision: 10, scale: 2 })
    @IsNumber()
    @Min(0)
    total: number;

    @Column({ default: 'Pending' })
    @IsString()
    status: string; // 'Pending', 'Preparing', 'Ready', 'Completed'

    @Column()
    @IsString()
    @IsNotEmpty()
    address: string;

    @CreateDateColumn()
    createdAt: Date;
}
