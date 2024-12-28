import { Controller, Post, Body, Get, Param, Patch, Delete, Request } from '@nestjs/common';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ResponseDto } from '../response/dto/response.dto';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) { }

  @Post()
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const result = await this.orderService.createOrder(req.user.id, createOrderDto);
    return new ResponseDto('success', 'Order created successfully', result);
  }

  @Get()
  async findAll(@Request() req) {
    return this.orderService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req) {
    return this.orderService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    const result = await this.orderService.update(+id, updateOrderDto);
    return new ResponseDto('success', 'Order updated successfully', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    await this.orderService.delete(+id, req.user.id);
    return new ResponseDto('success', 'Order deleted successfully', null);
  }
}
