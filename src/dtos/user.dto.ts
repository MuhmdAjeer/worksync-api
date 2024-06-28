import { BaseDto } from './base.dto';

export class UserDto extends BaseDto {
  username?: string;
  email: string;
  google_id?: string;
  verified_at?: Date;
  profile_picture?: string;
}
