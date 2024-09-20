import {
  BeforeCreate,
  Collection,
  Entity,
  EntityRepository,
  EntityRepositoryType,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { Base } from './base.entity';
import { WorkspaceMember } from './WorkspaceMember.entity';
import { OnboardMeta } from 'src/dtos/user.dto';

@Entity({ repository: () => UserRepo, tableName: 'users' })
export class User extends Base {
  [EntityRepositoryType]?: UserRepo;

  @Property()
  username?: string;

  @Property({ unique: true })
  email: string;

  @Property({ unique: true })
  google_id?: string;

  @Property()
  password: string;

  @Property({ default: null, nullable: true })
  verified_at?: Date;

  @Property({ default: null, nullable: true })
  profile_picture?: string;

  @OneToMany(() => WorkspaceMember, (workspaceMember) => workspaceMember.user)
  workspaces = new Collection<WorkspaceMember>(this);

  @Property({ type: 'json', nullable: true })
  onboarding: OnboardMeta = {
    is_onboarded: false,
    profile_complete: false,
    workspace_create: false,
    workspace_invite: false,
    workspace_join: false,
  };

  @BeforeCreate()
  async hashPassword() {
    if (this.password) {
      this.password = isHashed(this.password)
        ? this.password
        : hashPassword(this.password);
    }
  }

  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}

function isHashed(str: string) {
  return str.startsWith('$2b$');
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export class UserRepo extends EntityRepository<User> {}
