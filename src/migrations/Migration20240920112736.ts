import { Migration } from '@mikro-orm/migrations';

export class Migration20240920112736 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "workspace_name_index" on "workspace" ("name");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "workspace_name_index";');
  }

}
