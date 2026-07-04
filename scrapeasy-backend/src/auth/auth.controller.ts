import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly supabase: SupabaseService,
  ) {}

  @Post('send-otp')
  sendOtp(@Body('email') email: string) {
    return this.authService.sendOtp(email);
  }

  @Post('verify-otp')
  verifyOtp(@Body('email') email: string, @Body('token') token: string) {
    return this.authService.verifyOtp(email, token);
  }

  // ✅ UPDATED: Safe Login with proper error handling
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    // Backend ke .env se check karo
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPass) {
      // ✅ Supabase se real token generate karo
      const data = await this.supabase.signInWithPassword(email, password);
      console.log(data, '<------dataa')
      // ✅ SAFETY CHECK: Agar session ya token missing hai, toh error throw karo
      if (!data || !data.session || !data.session.access_token) {
        throw new UnauthorizedException('Invalid credentials or session missing');
      }

      return {
        message: 'Login successful',
        access_token: data.session.access_token, // Real JWT token
      };
    }

    throw new UnauthorizedException('Invalid admin credentials');
  }
}