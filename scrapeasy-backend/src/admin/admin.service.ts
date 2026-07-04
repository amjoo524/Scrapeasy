import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AnalyticsService } from '../analytics/analytics.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { UpdateScrapRatesDto } from './dto/update-scrap-rates.dto';

@Injectable()
export class AdminService {
  private supabase: SupabaseClient;

  constructor(private readonly analyticsService: AnalyticsService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  async getDashboard(): Promise<DashboardResponseDto> {
    const [stats, revenue_chart, pickups_chart, scrap_distribution, carbon_chart] =
      await Promise.all([
        this.analyticsService.getDashboardStats(),
        this.analyticsService.getRevenueChart(),
        this.analyticsService.getPickupsChart(),
        this.analyticsService.getScrapDistribution(),
        this.analyticsService.getCarbonChart(),
      ]);

    return {
      stats,
      revenue_chart,
      pickups_chart,
      scrap_distribution,
      carbon_chart,
    };
  }

  async getAllCustomers() {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, full_name, email, phone, role, is_active, created_at')
      .eq('role', 'customer')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data ?? [];
  }

  async getAllRiders() {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, full_name, email, phone, role, is_active, vehicle_info, created_at')
      .eq('role', 'rider')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data ?? [];
  }

  async getAllPickups() {
    const { data, error } = await this.supabase
      .from('pickups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data ?? [];
  }

  async getScrapRates() {
    const { data, error } = await this.supabase
      .from('scrap_categories')
      .select('id, name, rate_per_kg, unit, is_active, updated_at')
      .order('name', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data ?? [];
  }

  async assignRider(pickupId: string, riderId: string) {
    const { data, error } = await this.supabase
      .from('pickups')
      .update({ rider_id: riderId, status: 'accepted' })
      .eq('id', pickupId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }

    return data;
  }

  async updateScrapRates(dto: UpdateScrapRatesDto) {
    const updated: Record<string, unknown>[] = [];

    for (const rate of dto.rates) {
      const { data, error } = await this.supabase
        .from('scrap_categories')
        .update({
          rate_per_kg: rate.rate_per_kg,
          updated_at: new Date().toISOString(),
        })
        .eq('id', rate.id)
        .select('id, name, rate_per_kg, unit, updated_at')
        .single();

      if (error) {
        throw new InternalServerErrorException(error.message);
      }

      updated.push(data);
    }

    return { updated, count: updated.length };
  }

  async updateScrapRate(categoryId: string, ratePerKg: number) {
    const { data, error } = await this.supabase
      .from('scrap_categories')
      .update({
        rate_per_kg: ratePerKg,
        updated_at: new Date().toISOString(),
      })
      .eq('id', categoryId)
      .select('id, name, rate_per_kg, unit, updated_at')
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }
}
