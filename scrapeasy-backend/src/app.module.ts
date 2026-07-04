import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ScrapModule } from './scrap/scrap.module';
import { PickupsModule } from './pickups/pickups.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    ScrapModule,
    PickupsModule,
    PaymentsModule,
    AdminModule,
     NotificationsModule,
  ],
})
export class AppModule {}