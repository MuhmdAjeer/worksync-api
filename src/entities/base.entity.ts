import { v4 as uuid } from 'uuid';
import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class Base {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  created_at = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at = new Date();

  @Property({ nullable: true })
  deleted_at: Date | null = null;

  @Property({ version: true })
  version!: number;
}
