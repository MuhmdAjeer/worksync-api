import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Base } from './base.entity';
import { User } from './User.entity';
import { Issue } from './Issue.entity';

@Entity({ repository: () => CommentRepository })
export class Comment extends Base {
  [EntityRepositoryType]?: CommentRepository;

  @Property()
  content: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Issue)
  issue: Issue;

  constructor(obj: Partial<Comment>) {
    super();
    Object.assign(this, obj);
  }
}

export class CommentRepository extends EntityRepository<Comment> {}
