import { Migration } from '@mikro-orm/migrations';

export class Migration20241006183853 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "issue" add column "label_id" text null;');
    this.addSql('alter table "issue" add constraint "issue_label_id_foreign" foreign key ("label_id") references "issue_label" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "issue" drop constraint "issue_label_id_foreign";');

    this.addSql('alter table "issue" drop column "label_id";');
  }

}
