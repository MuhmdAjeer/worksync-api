import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/CreateUserDto';
import { User, UserRepo } from 'src/entities/User.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import { OTP, OtpRepo } from 'src/entities/Otp.entity';
import {
  EntityNotFoundException,
  InvalidPasswordException,
} from 'src/exceptions';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepo,
    private readonly jwtService: JwtService,
    private configSvc: ConfigService,
    private otpRepo: OtpRepo,
    private mailSvc: MailService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async register(createUserDto: CreateUserDto): Promise<User> {
    const userExist = await this.userRepo.findOne({
      email: createUserDto.email,
    });
    if (userExist) {
      throw new ConflictException('Email already exist');
    }
    const user = new User(createUserDto);

    this.logger.log({ user });
    await this.sendOTP(user.email);
    await this.userRepo.getEntityManager().persistAndFlush(user);

    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({ email });
    if (!user) {
      throw new EntityNotFoundException(email);
    }
    const compareRes = await bcrypt.compare(password, user.password);
    this.logger.error(password, user.password);
    if (!compareRes) {
      throw new InvalidPasswordException();
    }
    return user;
  }

  login(user: User): string {
    return this.generateToken(user);
  }

  generateToken(payload: JwtPayload): string {
    return this.jwtService.sign({
      id: payload.id,
      username: payload.username,
      email: payload.email,
      google_id: payload.google_id,
    });
  }

  async sendOTP(email: string) {
    const secret = speakeasy.generateSecret();
    const token = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });
    let otpModel: OTP;
    const OTPAlreadySent = await this.otpRepo.findOne({ email });
    if (OTPAlreadySent) {
      otpModel = OTPAlreadySent;
      otpModel.secret = secret.base32;
    } else {
      otpModel = new OTP({ email, secret: secret.base32 });
    }

    await this.mailSvc.sendOTPMail({ code: token, email: email });
    await this.otpRepo.getEntityManager().persistAndFlush(otpModel);
  }

  async verifyOtp(email: string, code: string) {
    const otpModel = await this.otpRepo.findOneOrFail({ email });
    const tokenValidates = speakeasy.totp.verify({
      secret: otpModel.secret,
      encoding: 'base32',
      token: code,
      window: 6,
    });
    if (!tokenValidates) throw new BadRequestException();
    const user = await this.userRepo.findOneOrFail({ email });
    user.verified_at = new Date();
    await this.userRepo.getEntityManager().persistAndFlush(user);
    return;
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepo.findOne({ id });
  }
}

export interface JwtPayload {
  id: string;
  username?: string;
  email: string;
  google_id?: string;
}
