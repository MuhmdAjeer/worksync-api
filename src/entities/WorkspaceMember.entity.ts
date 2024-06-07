import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

@Entity({ repository: () => WorkspaceMemberRepo })
export class WorkspaceMember {
  [EntityRepositoryType]?: WorkspaceMemberRepo;
  @PrimaryKey()
  id!: number;

  @Property()
  workspace_id: number;

  @Property()
  user_id: number;

  @Property()
  role: string;

  constructor(workspace_member: {
    workspace_id: number;
    user_id: number;
    role: string;
  }) {
    this.user_id = workspace_member.user_id;
    this.workspace_id = workspace_member.workspace_id;
    this.role = workspace_member.role;
  }
}

export class WorkspaceMemberRepo extends EntityRepository<WorkspaceMember> {}
