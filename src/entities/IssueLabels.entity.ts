import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Base } from './base.entity';
import { Project } from './Project.entity';

@Entity({ repository: () => IssueLabelRepo })
export class IssueLabel extends Base {
  [EntityRepositoryType]?: IssueLabelRepo;

  @Property()
  name: string;

  @Property()
  color: string;

  @ManyToOne(() => Project, { inversedBy: 'labels' })
  Project: Project;
  constructor(obj: Partial<IssueLabel>) {
    super();
    Object.assign(this, obj);
  }
}

export class IssueLabelRepo extends EntityRepository<IssueLabel> {}
