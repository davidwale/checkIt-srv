import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }), PrismaModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'orders*', method: RequestMethod.ALL });
  }
}