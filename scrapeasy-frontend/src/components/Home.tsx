"use client";

import { useState } from 'react';
import { publicApi } from '../lib/api';

export default function Home() {
  const [output, setOutput] = useState<string>('');

  const log = (label: string, data: unknown) => {
    setOutput(`${label}:\n${JSON.stringify(data, null, 2)}`);
  };

  const handleLogin = async () => {
    const email = window.prompt('Email');
    if (!email) return;
    try {
      await publicApi.sendOtp(email);
      const token = window.prompt('Enter OTP from email');
      if (!token) return;
      const res = await publicApi.verifyOtp(email, token);
      localStorage.setItem('access_token', res.access_token);
      log('Login', res);
    } catch (err: unknown) {
      log('Login Error', err instanceof Error ? err.message : err);
    }
  };

  const handleViewRates = async () => {
    try {
      const res = await publicApi.getRates();
      log('View Rates', res);
    } catch (err: unknown) {
      log('View Rates Error', err instanceof Error ? err.message : err);
    }
  };

  const handleCreatePickup = async () => {
    const customerId = window.prompt('Customer ID (UUID)') ?? '00000000-0000-0000-0000-000000000001';
    const address = window.prompt('Address') ?? '123 Test St';
    try {
      const res = await publicApi.createPickup({
        customer_id: customerId,
        address,
        status: 'pending',
        total_weight: 10,
      });
      log('Create Pickup', res);
    } catch (err: unknown) {
      log('Create Pickup Error', err instanceof Error ? err.message : err);
    }
  };

  return (
    <div>
      <h1>ScrapEasy Test Home</h1>
      <button type="button" onClick={handleLogin}>
        Login
      </button>
      <button type="button" onClick={handleViewRates}>
        View Rates
      </button>
      <button type="button" onClick={handleCreatePickup}>
        Create Pickup
      </button>
      <pre>{output}</pre>
    </div>
  );
}
