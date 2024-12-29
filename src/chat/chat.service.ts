import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';


@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) { }

  async sendMessage(chatRoomId: number, senderId: number, content: string) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoom) {
      throw new ForbiddenException('Chat room does not exist!');
    }
    if (chatRoom.isClosed) {
      throw new ForbiddenException('Chat room is closed');
    }

    return this.prisma.message.create({
      data: {
        chatRoomId,
        senderId,
        content,
      },
    });
  }

  async getChatMessages(chatRoomId: number, userId: number, isAdmin: boolean) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: { order: true },
    });

    if (!chatRoom || (!isAdmin && chatRoom.order.userId !== userId)) {
      throw new ForbiddenException('Cannot access chat');
    }

    return this.prisma.message.findMany({
      where: { chatRoomId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async closeChatRoom(chatRoomId: number, adminId: number, summary: string) {
    const chatRoom = await this.prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        isClosed: true,
        summary,
      },
    });

    return chatRoom;
  }
}

