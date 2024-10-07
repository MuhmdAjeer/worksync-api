import { Migration } from '@mikro-orm/migrations';

export class Migration20241007054243 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "issue_labels" ("issue_id" text not null, "issue_label_id" text not null, constraint "issue_labels_pkey" primary key ("issue_id", "issue_label_id"));');

    this.addSql('alter table "issue_labels" add constraint "issue_labels_issue_id_foreign" foreign key ("issue_id") references "issue" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "issue_labels" add constraint "issue_labels_issue_label_id_foreign" foreign key ("issue_label_id") references "issue_label" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "issue" drop constraint "issue_label_id_foreign";');

    this.addSql('alter table "issue" drop column "label_id";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "issue_labels" cascade;');

    this.addSql('alter table "issue" add column "label_id" text null;');
    this.addSql('alter table "issue" add constraint "issue_label_id_foreign" foreign key ("label_id") references "issue_label" ("id") on update cascade on delete set null;');
  }

}
