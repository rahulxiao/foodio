import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { Order } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() createOrderDto: Partial<Order> & { items: any[] }) {
        return this.ordersService.create(createOrderDto, createOrderDto.items);
    }

    @Get()
    findAll() {
        return this.ordersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(+id);
    }

    @Put(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.ordersService.updateStatus(+id, status);
    }
}
