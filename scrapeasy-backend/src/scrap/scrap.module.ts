import { Module } from '@nestjs/common';
import { ScrapController } from './scrape.controllar';
import { ScrapService } from './scrape.service';

@Module({
  controllers: [ScrapController],
  providers: [ScrapService],
})
export class ScrapModule {}

