import { Migration } from '@mikro-orm/migrations';

export class Migration20240719122022 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "issue" drop constraint if exists "issue_priority_check";');

    this.addSql('alter table "issue" add constraint "issue_priority_check" check("priority" in (\'Urgent\', \'High\', \'Medium\', \'Low\', \'None\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "issue" drop constraint if exists "issue_priority_check";');

    this.addSql('alter table "issue" add constraint "issue_priority_check" check("priority" in (\'Urgent\', \'High\', \'Medium\', \'Low\'));');
  }

}
