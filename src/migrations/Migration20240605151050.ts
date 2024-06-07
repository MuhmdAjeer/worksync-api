import { Migration } from '@mikro-orm/migrations';

export class Migration20240605151050 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" add column "cover_image" varchar(255) null, add column "logo" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" drop column "cover_image", drop column "logo";');
  }

}
