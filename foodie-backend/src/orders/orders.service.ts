import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemsRepository: Repository<OrderItem>,
        private usersService: UsersService,
    ) { }

    async create(orderData: Partial<Order>, items: any[]) {
        // Remove items from orderData if they exist to handle them separately
        const { items: _, ...restOrderData } = orderData as any;

        const order = new Order();
        Object.assign(order, restOrderData);

        // Fetch address from user profile if not provided
        if (!order.address || order.address === 'Address needed' || order.address === 'Default Address') {
            const user = await this.usersService.findOne(restOrderData.user.id);
            if (user && user.address) {
                order.address = user.address;
            }
        }

        order.status = 'Pending';
        order.createdAt = new Date();

        const savedOrder = await this.ordersRepository.save(order);

        // Create OrderItems with proper relation mapping
        const orderItems = items.map(item => {
            const orderItem = new OrderItem();
            orderItem.order = savedOrder;
            orderItem.quantity = item.quantity;
            orderItem.price = item.price;
            orderItem.menuItem = { id: Number(item.menuItemId) } as any;
            return orderItem;
        });

        await this.orderItemsRepository.save(orderItems);

        return this.findOne(savedOrder.id);
    }

    findAll(userId?: number) {
        return this.ordersRepository.find({
            where: userId ? { user: { id: userId } } : {},
            relations: {
                items: {
                    menuItem: true
                },
                user: true
            },
            order: { createdAt: 'DESC' }
        });
    }

    findOne(id: number) {
        return this.ordersRepository.findOne({
            where: { id },
            relations: {
                items: {
                    menuItem: true
                },
                user: true
            }
        });
    }

    async updateStatus(id: number, status: string) {
        await this.ordersRepository.update(id, { status });
        return this.findOne(id);
    }
}
