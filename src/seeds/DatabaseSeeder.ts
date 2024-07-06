import { ref, type EntityManager, wrap } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User, hashPassword } from '../entities/User.entity';
import { faker } from '@faker-js/faker';
import { Workspace } from 'src/entities/Workspace.entity';
import { Project } from 'src/entities/Project.entity';
import { emojiToDecimalUnicode, states } from 'src/constants/project';
import { IssueState } from 'src/entities/IssueState.entity';
import { Invitation } from 'src/entities/Invitation.entity';
import { EUserWorkspaceRoles } from 'src/dtos/workspace.dto';
import { WorkspaceMember } from 'src/entities/WorkspaceMember.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users = Array.from({ length: 20 }).map(() => {
      return new User({
        email: faker.internet.email(),
        password: hashPassword('12345678'),
        verified_at: faker.date.past(),
        profile_picture: faker.image.avatar(),
        username: faker.person.fullName(),
        onboarding: { is_onboarded: faker.datatype.boolean() },
      });
    });
    for (const user of users) {
      for (let i = 0; i < 3; i++) {
        const workspace = new Workspace({
          name: `${faker.word.adjective()}_${Math.floor(Math.random() * 100 + 1)}`,
          owner_id: user.id,
          use: 'Issue Tracking',
        });
        const project = new Project({
          cover_image: faker.image.url(),
          custom_id: faker.color.rgb(),
          lead: user,
          name: faker.word.verb(),
          logo: emojiToDecimalUnicode(faker.internet.emoji()),
          workspace: workspace,
          description: faker.lorem.sentence(),
        });
        for (const state of states) {
          const issueState = new IssueState({
            name: state.name,
            color: state.color,
            group: state.group,
            project: ref(project),
          });
          project.states.add(issueState);
        }
        for (const member of users) {
          if (Math.random() > 0.5) {
            const invitation = new Invitation({
              email: member.email,
              role: faker.helpers.enumValue(EUserWorkspaceRoles),
              workspace,
            });
            await em.persistAndFlush(invitation);
          } else {
            const workspaceMember = new WorkspaceMember({
              role: faker.helpers.enumValue(EUserWorkspaceRoles),
              user: member,
              workspace: workspace,
            });
            workspace.members.add(workspaceMember);
            await em.persistAndFlush(workspaceMember);
          }
        }
        workspace.projects.add(project);
        await em.persistAndFlush(workspace);
      }
    }
    await em.persistAndFlush(users);
  }
}
