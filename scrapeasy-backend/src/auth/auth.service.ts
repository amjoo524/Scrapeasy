import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase;

  constructor(private jwtService: JwtService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  async sendOtp(email: string) {
    const { error } = await this.supabase.auth.signInWithOtp({ email });
    if (error) throw new UnauthorizedException(error.message);
    return { message: 'OTP sent to email' };
  }

  async verifyOtp(email: string, token: string) {
    const { data, error } = await this.supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) throw new UnauthorizedException(error.message);
    const jwt = this.jwtService.sign({ sub: data.user?.id, email });
    return { access_token: jwt };
  }
}