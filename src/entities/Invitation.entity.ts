import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
  Ref,
  ref,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Workspace } from './Workspace.entity';
import { Base } from './base.entity';

@Entity({ repository: () => InvitationRepo })
export class Invitation extends Base {
  [EntityRepositoryType]?: Invitation;
  @Property()
  email: string;

  @ManyToOne()
  workspace: Ref<Workspace>;

  @Property({ default: false })
  is_accepted: boolean;

  @Property()
  role: string;

  constructor(invitation: {
    role: string;
    email: string;
    workspace: Workspace;
  }) {
    super();
    this.email = invitation.email;
    this.workspace = ref(invitation.workspace);
    this.role = invitation.role;
  }
}

export class InvitationRepo extends EntityRepository<Invitation> {}
