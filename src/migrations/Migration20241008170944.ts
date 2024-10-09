import { Migration } from '@mikro-orm/migrations';

export class Migration20241008170944 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "comment" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "version" int not null default 1, "content" text not null, "user_id" text not null, "issue_id" text not null, constraint "comment_pkey" primary key ("id"));');

    this.addSql('alter table "comment" add constraint "comment_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_issue_id_foreign" foreign key ("issue_id") references "issue" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "comment" cascade;');
  }

}
