import { Controller, Get, Post, Body, Patch, Param, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) { }

  @Post(':chatRoomId/message')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendMessage(
    @Param('chatRoomId') chatRoomId: number,
    @Request() req,
    @Body() messageDto: MessageDto
  ) {
    const { content } = messageDto;
    const adminId = null;
    return this.chatService.sendMessage(chatRoomId, req.user.id, adminId, content);
  }

  @Get(':chatRoomId/messages')
  async getMessages(@Param('chatRoomId') chatRoomId: number, @Request() req) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.chatService.getChatMessages(chatRoomId, req.user.id, isAdmin);
  }


}

