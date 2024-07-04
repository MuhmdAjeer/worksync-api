import { BaseDto } from './base.dto';

export class UserDto extends BaseDto {
  username?: string;
  email: string;
  google_id?: string;
  verified_at?: Date;
  profile_picture?: string;
  onboarding?: OnboardMeta;
}

export class OnboardMeta {
  is_onboarded?: boolean;
  profile_complete?: boolean;
  workspace_create?: boolean;
  workspace_invite?: boolean;
  workspace_join?: boolean;
}
