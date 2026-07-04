import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notification.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  saveNotification(
    @Body('user_id') userId: string,
    @Body('title') title: string,
    @Body('message') message: string,
  ) {
    return this.notificationsService.saveNotification(userId, title, message);
  }

  @Get(':userId')
  getUserNotifications(@Param('userId') userId: string) {
    return this.notificationsService.getUserNotifications(userId);
  }
}