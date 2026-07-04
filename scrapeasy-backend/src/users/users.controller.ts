import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Put(':id')
  updateProfile(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateProfile(id, body);
  }
}