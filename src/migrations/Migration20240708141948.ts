import { Migration } from '@mikro-orm/migrations';

export class Migration20240708141948 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "issue" drop constraint if exists "issue_priority_check";');

    this.addSql('alter table "issue" alter column "priority" type text using ("priority"::text);');
    this.addSql('alter table "issue" add constraint "issue_priority_check" check("priority" in (\'Urgent\', \'High\', \'Medium\', \'Low\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "issue" drop constraint if exists "issue_priority_check";');

    this.addSql('alter table "issue" alter column "priority" type smallint using ("priority"::smallint);');
  }

}
