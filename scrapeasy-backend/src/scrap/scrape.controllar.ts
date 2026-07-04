import { Controller, Get } from '@nestjs/common';
import { ScrapService } from './scrape.service';

@Controller('scrap')
export class ScrapController {
  constructor(private readonly scrapService: ScrapService) {}

  @Get('categories')
  getCategories() {
    return this.scrapService.getCategories();
  }

  @Get('rates/today')
  getTodayRates() {
    return this.scrapService.getTodayRates();
  }
}