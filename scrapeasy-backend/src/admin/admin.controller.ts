import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { UpdateScrapRatesDto } from './dto/update-scrap-rates.dto';

@Controller('admin')
// @UseGuards( RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('customers')
  getAllCustomers() {
    return this.adminService.getAllCustomers();
  }

  @Get('riders')
  getAllRiders() {
    return this.adminService.getAllRiders();
  }

  @Get('pickups')
  getAllPickups() {
    return this.adminService.getAllPickups();
  }

  @Get('scrap/rates')
  getScrapRates() {
    return this.adminService.getScrapRates();
  }

  @Put('scrap/rates')
  updateScrapRates(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: UpdateScrapRatesDto,
  ) {
    return this.adminService.updateScrapRates(dto);
  }

  @Put('scrap/rates/:id')
  updateScrapRate(
    @Param('id') categoryId: string,
    @Body('rate_per_kg') ratePerKg: number,
  ) {
    return this.adminService.updateScrapRate(categoryId, ratePerKg);
  }

  @Put('pickups/:id/assign')
  assignRider(
    @Param('id') pickupId: string,
    @Body('rider_id') riderId: string,
  ) {
    return this.adminService.assignRider(pickupId, riderId);
  }
}
