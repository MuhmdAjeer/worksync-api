import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from './User.entity';
import { Workspace } from './Workspace.entity';

@Entity({ repository: () => WorkspaceMemberRepo })
export class WorkspaceMember {
  [EntityRepositoryType]?: WorkspaceMemberRepo;
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Workspace)
  workspace!: Workspace;

  @Property()
  role: string;

  constructor(member: Partial<WorkspaceMember>) {
    Object.assign(this, member);
  }
}

export class WorkspaceMemberRepo extends EntityRepository<WorkspaceMember> {}
