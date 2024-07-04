import { v4 as uuid } from 'uuid';
import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class Base {
  @PrimaryKey()
  id: string = uuid();

  @Property({ onCreate: () => new Date(), defaultRaw: 'now()' })
  created_at = new Date();

  @Property({
    onUpdate: () => new Date(),
    onCreate: () => new Date(),
    defaultRaw: 'now()',
  })
  updated_at = new Date();

  @Property({ nullable: true })
  deleted_at: Date | null = null;

  @Property({ version: true, default: 1 })
  version!: number;
}
