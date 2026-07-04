import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class NotificationsService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  async saveNotification(userId: string, title: string, message: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert({ user_id: userId, title, message })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async getUserNotifications(userId: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }
}