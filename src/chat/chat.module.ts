import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }), PrismaModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'chat*', method: RequestMethod.ALL });
  }
}
