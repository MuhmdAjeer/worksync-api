import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

@Entity({ repository: () => OtpRepo })
export class OTP {
  [EntityRepositoryType]?: OtpRepo;
  @PrimaryKey()
  id!: number;

  @Property()
  email: string;

  @Property()
  secret: string;

  constructor(user: { email: string; secret: string }) {
    this.email = user.email;
    this.secret = user.secret;
  }
}

export class OtpRepo extends EntityRepository<OTP> {}
