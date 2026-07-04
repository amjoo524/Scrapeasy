import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class ScrapService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  async getCategories() {
    const { data, error } = await this.supabase
      .from('scrap_categories')
      .select('*')
      .eq('is_active', true);
    if (error) throw new Error(error.message);
    return data;
  }

  async getTodayRates() {
    const { data, error } = await this.supabase
      .from('scrap_categories')
      .select('id, name, rate_per_kg, unit')
      .eq('is_active', true);
    if (error) throw new Error(error.message);
    return data;
  }
}