import { Module } from '@nestjs/common';
import { PickupsService } from './pickups.service';
import { PickupsController } from './pickups.controllars';

@Module({
  controllers: [PickupsController],
  providers: [PickupsService],
})
export class PickupsModule {}