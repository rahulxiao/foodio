import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemsRepository: Repository<OrderItem>,
    ) { }

    async create(orderData: Partial<Order>, items: any[]) {
        // 1. Create Order
        // Note: Assuming `items` array comes with { menuItemId, quantity, price }

        const order = this.ordersRepository.create({
            ...orderData,
            status: 'Pending',
            createdAt: new Date(),
        });

        const savedOrder = await this.ordersRepository.save(order);

        // 2. Create OrderItems
        // Ideally we would fetch MenuItem price here to prevent frontend manipulation, 
        // but for this MVP we'll trust the input or simple relation.

        const orderItems = items.map(item => this.orderItemsRepository.create({
            order: savedOrder,
            quantity: item.quantity,
            price: item.price,
            menuItem: { id: item.menuItemId } as any // Relation reference
        }));

        await this.orderItemsRepository.save(orderItems);

        return this.findOne(savedOrder.id);
    }

    findAll() {
        return this.ordersRepository.find({
            relations: ['items', 'items.menuItem', 'user'],
            order: { createdAt: 'DESC' }
        });
    }

    findOne(id: number) {
        return this.ordersRepository.findOne({
            where: { id },
            relations: ['items', 'items.menuItem', 'user']
        });
    }

    async updateStatus(id: number, status: string) {
        await this.ordersRepository.update(id, { status });
        return this.findOne(id);
    }
}
