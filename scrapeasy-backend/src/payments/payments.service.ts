import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class PaymentsService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  async createPayment(body: any) {
    const { data, error } = await this.supabase
      .from('payments')
      .insert(body)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async getPaymentById(id: string) {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async getPaymentHistory(customerId: string) {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('customer_id', customerId)
      .order('paid_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async updatePaymentStatus(id: string, status: string, transactionId?: string) {
    const { data, error } = await this.supabase
      .from('payments')
      .update({ status, transaction_id: transactionId })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}