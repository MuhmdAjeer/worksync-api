import { BaseDto } from './base.dto';

export class WorkspaceDto extends BaseDto {
  name: string;
  use: string;
  owner_id: string;
}
