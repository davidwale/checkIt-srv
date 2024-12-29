import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    const order = await this.prisma.order.create({
      data: {
        ...createOrderDto,
        userId,
      },
    });

    const chatRoom = await this.prisma.chatRoom.create({
      data: {
        orderId: order.id,
        userId,
      },
    });

    return { order, chatRoom };
  }

  async findAll(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: number, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  async delete(id: number, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }
    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
