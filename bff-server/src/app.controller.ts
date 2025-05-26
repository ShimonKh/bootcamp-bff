import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';
import { AppService } from './app.service';
import { OTP_TOKENS } from './mock/otp-tokens.mock';
import { mogo } from "./mock/mogo";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('getHello endpoint called');
    return this.appService.getHello();
  }

  @Get('sendsms')
  async sendSms(@Query('phone') phone: string): Promise<any> {
    console.log('sendSms endpoint called with phone:', phone);

    if (!phone) {
      console.log('Error: Missing phone number');
      return { error: 'Missing phone number' };
    }

    try {
      console.log('Attempting to login to mogo.io with credentials:', { login: mogo.ll });
      console.log('Using login credentials:', JSON.stringify({ login: mogo.ll, password: '***MASKED***' }));

      const loginRes = await axios.post('https://mogo.io/api/v1/auth/login', {
        login: mogo.ll,
        password: mogo.pp,
      });

      console.log('Login response received:', loginRes.status);
      console.log('Login response data:', JSON.stringify(loginRes.data, null, 2));
      const token = loginRes.data.token;
      const mogoAccountId = loginRes.data.account.mogoAccountId;
      console.log('Using token:', token);
      console.log('Using mogoAccountId:', mogoAccountId);

      const randomIndex = Math.floor(Math.random() * OTP_TOKENS.length);
      const otp = OTP_TOKENS[randomIndex];
      console.log('Generated OTP:', otp, 'from index:', randomIndex);

      console.log('Sending SMS message with payload:', {
        message: otp,
        from: 'PassportCard',
        to: [phone.toString()],
        immediate: false,
        dlrState: 'all',
        customSendId: '123',
      });

      const sendRes = await axios.post(
        'https://mogo.io/api/v1/message-send',
        {
          message: otp,
          from: 'PassportCard',
          to: [phone.toString()],
          immediate: false,
          dlrState: 'all',
          customSendId: '123',
          mogoAccountId: mogoAccountId
        },
        {
          headers: {
            Authorization: token
          },
        }
      );

      console.log('SMS send response received:', sendRes.status);
      return { sent: true, otp, response: sendRes.data };
    } catch (error) {
      console.error('Error in sendSms endpoint:', error.message);
      console.error('Full error:', error);
      return {
        error: true,
        message: error.message,
        response: error.response?.data || 'No response data'
      };
    }
  }
}
