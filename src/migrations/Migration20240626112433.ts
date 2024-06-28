import { Migration } from '@mikro-orm/migrations';

export class Migration20240626112433 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "issue_state" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "version" int not null default 1, "name" varchar(255) not null, "color" varchar(255) null, "group" varchar(255) not null, "description" varchar(255) null, "project_id" varchar(255) not null, constraint "issue_state_pkey" primary key ("id"));');

    this.addSql('create table "issue_label" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "version" int not null default 1, "name" varchar(255) not null, "color" varchar(255) not null, "project_id" varchar(255) not null, constraint "issue_label_pkey" primary key ("id"));');

    this.addSql('alter table "issue_state" add constraint "issue_state_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');

    this.addSql('alter table "issue_label" add constraint "issue_label_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');

    this.addSql('alter table "issue" drop column "state";');

    this.addSql('alter table "workspace_member" alter column "workspace_id" type varchar(255) using ("workspace_id"::varchar(255));');
    this.addSql('alter table "workspace_member" alter column "user_id" type varchar(255) using ("user_id"::varchar(255));');
    this.addSql('alter table "workspace_member" add constraint "workspace_member_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "workspace_member" add constraint "workspace_member_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "issue_state" cascade;');

    this.addSql('drop table if exists "issue_label" cascade;');

    this.addSql('alter table "workspace_member" drop constraint "workspace_member_user_id_foreign";');
    this.addSql('alter table "workspace_member" drop constraint "workspace_member_workspace_id_foreign";');

    this.addSql('alter table "issue" add column "state" text check ("state" in (\'Backlog\', \'Todo\', \'In progress\', \'Done\', \'Cancelled\')) not null;');

    this.addSql('alter table "workspace_member" alter column "user_id" type int using ("user_id"::int);');
    this.addSql('alter table "workspace_member" alter column "workspace_id" type int using ("workspace_id"::int);');
  }

}
