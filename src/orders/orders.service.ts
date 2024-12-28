import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        description: createOrderDto.description,
        specifications: createOrderDto.specifications,
        quantity: createOrderDto.quantity,
        metadata: createOrderDto.metadata,
        status: 'Review',
        user: { connect: { id: createOrderDto.userId } },
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany();
  }
}
