import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }

  async findAllChatRooms() {
    return this.prisma.chatRoom.findMany();
  }

  async findChatRoomById(chatRoomId: number) {
    const chatRoom = this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: { messages: true, order: true },
    });
    if (!chatRoom) {
      throw new NotFoundException('ChatRoom Not Found!');
    }
    return chatRoom;
  }

  async findAllOrders() {
    return this.prisma.order.findMany();
  }

  async findOrderById(orderId: number) {
    const orders = this.prisma.order.findUnique({
      where: { id: orderId },
      include: { chatRoom: true },
    });
    if (!orders) {
      throw new NotFoundException('Order does not exist!');
    }

    return orders;
  }

  async findOrdersByUserId(userId: number) {
    const orders = this.prisma.order.findMany({
      where: { userId },
    });
    if (!orders) {
      throw new NotFoundException('User has not make any order!');
    }

    return orders;
  }

  async findChatRoomsByUserId(userId: number) {
    const chatRooms = this.prisma.chatRoom.findMany({
      where: {
        order: {
          userId,
        },
      },
      include: { order: true },
    });
    if (!chatRooms) {
      throw new NotFoundException('No chatRooms Found!');
    }
    return chatRooms;
  }

  async sendMessage(chatRoomId: number, adminId: number | null, content: string) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoom) {
      throw new NotFoundException('Chat room does not exist!');
    }
    if (chatRoom.isClosed) {
      throw new ForbiddenException('Chat room is closed.');
    }

    return this.prisma.message.create({
      data: {
        chatRoomId,
        adminId: adminId || null,
        content,
      },
    });
  }

  async closeChatRoom(chatRoomId: number, adminId: number, summary: string) {
    const chatRoom = await this.prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        isClosed: true,
        summary,
        closedBy: adminId,
      },
    });

    return chatRoom;
  }

  async completeOrder(orderId: number) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: "completed"
      },
    });

    return order;
  }
}
