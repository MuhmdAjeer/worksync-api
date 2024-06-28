import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  created_at?: Date;
  @ApiProperty()
  updated_at?: Date;
  @ApiProperty()
  deleted_at?: Date | null;
  @ApiProperty()
  version: number;
}
