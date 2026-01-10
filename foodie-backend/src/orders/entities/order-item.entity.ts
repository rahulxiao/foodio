import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { MenuItem } from '../../menu/entities/menu-item.entity';
import { IsNumber, Min } from 'class-validator';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    order: Order;

    @ManyToOne(() => MenuItem)
    menuItem: MenuItem;

    @Column()
    @IsNumber()
    @Min(1)
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    @IsNumber()
    @Min(0)
    price: number; // Price at time of order
}
