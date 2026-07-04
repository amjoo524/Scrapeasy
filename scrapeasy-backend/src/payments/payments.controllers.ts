import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  createPayment(@Body() body: any) {
    return this.paymentsService.createPayment(body);
  }

  @Get('history/:customerId')
  getPaymentHistory(@Param('customerId') customerId: string) {
    return this.paymentsService.getPaymentHistory(customerId);
  }

  @Get(':id')
  getPaymentById(@Param('id') id: string) {
    return this.paymentsService.getPaymentById(id);
  }

  @Post('jazzcash/callback')
  jazzCashCallback(@Body() body: any) {
    return this.paymentsService.updatePaymentStatus(
      body.pickupId,
      body.status,
      body.transactionId,
    );
  }

  @Post('easypaisa/callback')
  easypaisaCallback(@Body() body: any) {
    return this.paymentsService.updatePaymentStatus(
      body.pickupId,
      body.status,
      body.transactionId,
    );
  }
}