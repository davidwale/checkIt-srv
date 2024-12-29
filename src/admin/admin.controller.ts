import { Controller, Get, Param, Post, Patch, Body, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin-guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) { }

  @Get('chatrooms')
  async findAllChatRooms() {
    return this.adminService.findAllChatRooms();
  }

  @Get('chatrooms/:chatRoomId')
  async findChatRoomById(@Param('chatRoomId') chatRoomId: number) {
    return this.adminService.findChatRoomById(+chatRoomId);
  }

  @Get('orders')
  async findAllOrders() {
    return this.adminService.findAllOrders();
  }

  @Get('orders/:orderId')
  async findOrderById(@Param('orderId') orderId: number) {
    return this.adminService.findOrderById(+orderId);
  }

  @Get('orders/user/:userId')
  async findOrdersByUserId(@Param('userId') userId: number) {
    return this.adminService.findOrdersByUserId(+userId);
  }

  @Get('chatrooms/user/:userId')
  async findChatRoomsByUserId(@Param('userId') userId: number) {
    return this.adminService.findChatRoomsByUserId(+userId);
  }

  @Post('chat/:chatRoomId/message')
  async sendMessage(
    @Param('chatRoomId') chatRoomId: number,
    @Request() req,
    @Body() body
  ) {
    const { content } = body;
    return this.adminService.sendMessage(chatRoomId, req.user.id, content);
  }

  @Patch('chat/:chatRoomId/close')
  async closeChatRoom(
    @Param('chatRoomId') chatRoomId: number,
    @Request() req,
    @Body() body
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can close chat rooms');
    }

    const { summary } = body;
    return this.adminService.closeChatRoom(chatRoomId, req.user.id, summary);
  }
}
