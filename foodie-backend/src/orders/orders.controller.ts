import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
        // Ensure the order is created for the authenticated user
        const { items, ...orderData } = createOrderDto;
        const completeOrderData = {
            ...orderData,
            user: { id: req.user.userId } as any
        };
        return this.ordersService.create(completeOrderData, items);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Request() req) {
        // If admin, see all. If user, see only own.
        const userId = req.user.role === 'admin' ? undefined : req.user.userId;
        return this.ordersService.findAll(userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        const order = await this.ordersService.findOne(id);

        // Security check: only owner or admin can see specific order details
        if (req.user.role !== 'admin' && order?.user?.id !== req.user.userId) {
            return { message: 'Unauthorized', statusCode: 401 };
        }

        return order;
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id/status')
    updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateOrderStatusDto) {
        // Typically only admin can update status
        return this.ordersService.updateStatus(id, updateStatusDto.status);
    }
}
