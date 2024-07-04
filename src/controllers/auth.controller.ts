import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/dtos/CreateUserDto';
import { User } from 'src/entities/User.entity';
import { AuthService } from 'src/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { SendOTPDto, verifyOTPDto } from 'src/dtos/VerificationDto';
import { JwtAuthGuard, LocalAuthGuard } from 'src/guards';
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger('auth controller');

  @Post('register')
  @ApiBadRequestResponse({ type: BadRequestException })
  register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Req() req: Request & { user: User },
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const token = this.authService.login(req.user);
    response.cookie('jwt', token, {
      httpOnly: true,
      signed: false,
      secure: false,
    });
    return { access_token: token, ...req.user };
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { success: true };
  }

  @Post('verify/otp/send')
  async sendOtp(@Body() { email }: SendOTPDto) {
    await this.authService.sendOTP(email);
    return;
  }

  @Post('/verify/otp')
  async verifyOtp(@Body() { code, email }: verifyOTPDto) {
    await this.authService.verifyOtp(email, code);
    return;
  }
}
