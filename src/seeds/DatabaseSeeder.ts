import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../entities/User.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const user = new User({
      email: 'test@test.com',
      password: '12345678',
      verified_at: new Date(),
    });

    em.persist(user);
  }
}
