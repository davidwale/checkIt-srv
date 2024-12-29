import { Controller, Get, Post, Body, Patch, Param, Request, ForbiddenException } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) { }

  @Post(':chatRoomId/message')
  async sendMessage(
    @Param('chatRoomId') chatRoomId: number,
    @Request() req,
    @Body() body
  ) {
    const { content } = body;
    return this.chatService.sendMessage(chatRoomId, req.user.id, content);
  }

  @Get(':chatRoomId/messages')
  async getMessages(@Param('chatRoomId') chatRoomId: number, @Request() req) {
    const isAdmin = req.user.role === 'admin';
    return this.chatService.getChatMessages(chatRoomId, req.user.id, isAdmin);
  }

  @Patch(':chatRoomId/close')
  async closeChatRoom(
    @Param('chatRoomId') chatRoomId: number,
    @Request() req,
    @Body() body
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admins can close chat rooms');
    }

    const { summary } = body;
    return this.chatService.closeChatRoom(chatRoomId, req.user.id, summary);
  }
}

