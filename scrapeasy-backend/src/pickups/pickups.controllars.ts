import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { PickupsService } from './pickups.service';

@Controller('pickups')
export class PickupsController {
  constructor(private readonly pickupsService: PickupsService) {}

  @Post()
  createPickup(@Body() body: any) {
    return this.pickupsService.createPickup(body);
  }

  @Get('customer/:customerId')
  getPickups(@Param('customerId') customerId: string) {
    return this.pickupsService.getPickups(customerId);
  }

  @Get(':id')
  getPickupById(@Param('id') id: string) {
    return this.pickupsService.getPickupById(id);
  }

  @Put(':id/cancel')
  cancelPickup(@Param('id') id: string) {
    return this.pickupsService.cancelPickup(id);
  }
}