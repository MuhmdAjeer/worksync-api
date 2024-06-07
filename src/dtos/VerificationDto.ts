import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class SendOTPDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}

export class verifyOTPDto {
  @Length(6)
  @ApiProperty()
  code: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}
