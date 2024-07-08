import { Migration } from '@mikro-orm/migrations';

export class Migration20240708135909 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "issue_state" add constraint "issue_state_group_check" check("group" in (\'backlog\', \'unstarted\', \'started\', \'completed\', \'cancelled\'));');

    this.addSql('alter table "issue" add column "state_id" text null;');
    this.addSql('alter table "issue" alter column "description" type text using ("description"::text);');
    this.addSql('alter table "issue" alter column "description" drop not null;');
    this.addSql('alter table "issue" alter column "start_date" type timestamptz using ("start_date"::timestamptz);');
    this.addSql('alter table "issue" alter column "start_date" drop not null;');
    this.addSql('alter table "issue" alter column "end_date" type timestamptz using ("end_date"::timestamptz);');
    this.addSql('alter table "issue" alter column "end_date" drop not null;');
    this.addSql('alter table "issue" add constraint "issue_state_id_foreign" foreign key ("state_id") references "issue_state" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "issue_state" drop constraint if exists "issue_state_group_check";');

    this.addSql('alter table "issue" drop constraint "issue_state_id_foreign";');

    this.addSql('alter table "issue_state" alter column "group" type text using ("group"::text);');

    this.addSql('alter table "issue" drop column "state_id";');

    this.addSql('alter table "issue" alter column "description" type text using ("description"::text);');
    this.addSql('alter table "issue" alter column "description" set not null;');
    this.addSql('alter table "issue" alter column "start_date" type timestamptz using ("start_date"::timestamptz);');
    this.addSql('alter table "issue" alter column "start_date" set not null;');
    this.addSql('alter table "issue" alter column "end_date" type timestamptz using ("end_date"::timestamptz);');
    this.addSql('alter table "issue" alter column "end_date" set not null;');
  }

}
