import {
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  Ref,
  ref,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Workspace } from './Workspace.entity';
import { Base } from './base.entity';
import { EUserWorkspaceRoles } from 'src/dtos/workspace.dto';

@Entity({ repository: () => InvitationRepo })
export class Invitation extends Base {
  [EntityRepositoryType]?: Invitation;
  @Property()
  email: string;

  @ManyToOne()
  workspace: Ref<Workspace>;

  @Property({ default: false })
  is_accepted: boolean;

  @Enum(() => EUserWorkspaceRoles)
  role: EUserWorkspaceRoles;

  constructor(invitation: {
    role: EUserWorkspaceRoles;
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
