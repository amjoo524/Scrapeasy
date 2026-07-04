import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class PickupsService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  async createPickup(body: any) {
    const { data, error } = await this.supabase
      .from('pickups')
      .insert(body)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async getPickups(customerId: string) {
    const { data, error } = await this.supabase
      .from('pickups')
      .select('*')
      .eq('customer_id', customerId);
    if (error) throw new Error(error.message);
    return data;
  }

  async getPickupById(id: string) {
    const { data, error } = await this.supabase
      .from('pickups')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async cancelPickup(id: string) {
    const { data, error } = await this.supabase
      .from('pickups')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}