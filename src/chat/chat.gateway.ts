import { Injectable, UnauthorizedException } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@Injectable()
@WebSocketGateway({ cors: { origin: process.env.ALLOWED_CLIENT_URL } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService
  ) { }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.query.token as string;

      if (!token) {
        throw new UnauthorizedException('Token not provided');
      }

      const decoded = this.jwtService.verify(token);
      client.data.user = decoded;

    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { chatRoomId: number; content: string; senderId: number; adminId: number | null },
    @ConnectedSocket() client: Socket
  ) {
    const { chatRoomId, content, senderId, adminId } = data;

    try {
      const message = await this.chatService.sendMessage(chatRoomId, senderId, adminId, content);

      this.server.to(`chatRoom_${chatRoomId}`).emit('receive_message', {
        content: message.content,
        senderId: message.senderId,
        adminId: adminId,
      });
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('join_chat')
  handleJoinChat(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket
  ) {
    const { chatRoomId } = data;

    client.join(`chatRoom_${chatRoomId}`);
    client.emit('joined_chat', `You joined chat room ${chatRoomId}`);
  }
}
