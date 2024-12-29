import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }), PrismaModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'admin*', method: RequestMethod.ALL });
  }
}
