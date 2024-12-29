import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [OrdersModule, AuthModule, ChatModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule { }
