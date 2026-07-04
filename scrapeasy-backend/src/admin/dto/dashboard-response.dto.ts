export class DashboardStatsDto {
  total_pickups: number;
  active_sellers: number;
  carbon_saved_kg: number;
  total_revenue: number;
}

export class ChartPointDto {
  label: string;
  value: number;
}

export class DashboardResponseDto {
  stats: DashboardStatsDto;
  revenue_chart: ChartPointDto[];
  pickups_chart: ChartPointDto[];
  scrap_distribution: ChartPointDto[];
  carbon_chart: ChartPointDto[];
}
