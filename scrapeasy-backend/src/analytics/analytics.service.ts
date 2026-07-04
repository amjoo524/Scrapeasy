import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ChartPointDto, DashboardStatsDto } from '../admin/dto/dashboard-response.dto';

const CARBON_FACTOR_KG = 2.5;
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

@Injectable()
export class AnalyticsService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  async getDashboardStats(): Promise<DashboardStatsDto> {
    const [pickupsRes, sellersRes, paymentsRes, weightRes] = await Promise.all([
      this.supabase.from('pickups').select('id', { count: 'exact', head: true }),
      this.supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'customer'),
      this.supabase
        .from('payments')
        .select('total_amount')
        .eq('status', 'paid'),
      this.supabase.from('pickups').select('total_weight'),
    ]);

    const totalRevenue =
      paymentsRes.data?.reduce(
        (sum, payment) => sum + (Number(payment.total_amount) || 0),
        0,
      ) ?? 0;

    const totalWeight =
      weightRes.data?.reduce(
        (sum, pickup) => sum + (Number(pickup.total_weight) || 0),
        0,
      ) ?? 0;

    return {
      total_pickups: pickupsRes.count ?? 0,
      active_sellers: sellersRes.count ?? 0,
      carbon_saved_kg: Math.round(totalWeight * CARBON_FACTOR_KG),
      total_revenue: totalRevenue,
    };
  }

  async getRevenueChart(): Promise<ChartPointDto[]> {
    const { data } = await this.supabase
      .from('payments')
      .select('total_amount, paid_at, created_at')
      .eq('status', 'paid');

    const buckets = Array.from({ length: 6 }, () => 0);
    const now = new Date();

    for (const payment of data ?? []) {
      const dateValue = payment.paid_at ?? payment.created_at;
      if (!dateValue) continue;

      const paidAt = new Date(dateValue);
      const monthDiff =
        (now.getFullYear() - paidAt.getFullYear()) * 12 +
        (now.getMonth() - paidAt.getMonth());

      if (monthDiff >= 0 && monthDiff < 6) {
        buckets[5 - monthDiff] += Number(payment.total_amount) || 0;
      }
    }

    return buckets.map((value, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        label: MONTH_LABELS[date.getMonth()],
        value: Math.round(value),
      };
    });
  }

  async getPickupsChart(): Promise<ChartPointDto[]> {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const { data } = await this.supabase
      .from('pickups')
      .select('created_at')
      .gte('created_at', start.toISOString());

    const buckets = Array.from({ length: 7 }, () => 0);

    for (const pickup of data ?? []) {
      if (!pickup.created_at) continue;
      const createdAt = new Date(pickup.created_at);
      createdAt.setHours(0, 0, 0, 0);
      const dayDiff = Math.floor(
        (createdAt.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (dayDiff >= 0 && dayDiff < 7) {
        buckets[dayDiff] += 1;
      }
    }

    return buckets.map((value, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        label: DAY_LABELS[date.getDay()],
        value,
      };
    });
  }

  async getScrapDistribution(): Promise<ChartPointDto[]> {
    const { data: categories } = await this.supabase
      .from('scrap_categories')
      .select('id, name');

    if (!categories?.length) {
      return [{ label: 'No Data', value: 1 }];
    }

    const { data: items } = await this.supabase
      .from('pickup_items')
      .select('category_id, weight_kg');

    if (items?.length) {
      const totals = new Map<string, number>();
      for (const item of items) {
        const key = item.category_id ?? 'unknown';
        totals.set(key, (totals.get(key) ?? 0) + (Number(item.weight_kg) || 0));
      }

      return categories
        .map((category) => ({
          label: category.name,
          value: Math.round(totals.get(category.id) ?? 0),
        }))
        .filter((entry) => entry.value > 0);
    }

    const { data: pickups } = await this.supabase
      .from('pickups')
      .select('category_id, total_weight');

    const totals = new Map<string, number>();
    for (const pickup of pickups ?? []) {
      const key = pickup.category_id ?? 'unknown';
      totals.set(
        key,
        (totals.get(key) ?? 0) + (Number(pickup.total_weight) || 1),
      );
    }

    const distribution = categories
      .map((category) => ({
        label: category.name,
        value: Math.round(totals.get(category.id) ?? 0),
      }))
      .filter((entry) => entry.value > 0);

    return distribution.length ? distribution : [{ label: 'Uncategorized', value: 1 }];
  }

  async getCarbonChart(): Promise<ChartPointDto[]> {
    const start = new Date();
    start.setMonth(start.getMonth() - 5);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const { data } = await this.supabase
      .from('pickups')
      .select('created_at, total_weight')
      .gte('created_at', start.toISOString());

    const buckets = Array.from({ length: 6 }, () => 0);
    const now = new Date();

    for (const pickup of data ?? []) {
      if (!pickup.created_at) continue;
      const createdAt = new Date(pickup.created_at);
      const monthDiff =
        (now.getFullYear() - createdAt.getFullYear()) * 12 +
        (now.getMonth() - createdAt.getMonth());

      if (monthDiff >= 0 && monthDiff < 6) {
        buckets[5 - monthDiff] +=
          (Number(pickup.total_weight) || 0) * CARBON_FACTOR_KG;
      }
    }

    return buckets.map((value, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        label: MONTH_LABELS[date.getMonth()],
        value: Math.round(value),
      };
    });
  }
}
