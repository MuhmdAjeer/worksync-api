import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { CreateIssueDto } from 'src/dtos/Issue.dto';
import { IssueDto } from 'src/dtos/project.dto';
import { Issue, IssueRepo } from 'src/entities/Issue.entity';
import { Project } from 'src/entities/Project.entity';
import { User, UserRepo } from 'src/entities/User.entity';

@Injectable()
export class IssueService {
  constructor(
    private issueRepo: IssueRepo,
    private userRepo: UserRepo,
    private clsService: ClsService,
  ) {}
  async create(createIssueDto: CreateIssueDto, project: Project): Promise<IssueDto> {
    const issue = new Issue(createIssueDto);
    issue.Project = project;
    for (const assigneeId of createIssueDto.assignees_id) {
      const user = await this.userRepo.findOneOrFail({ id: assigneeId });
      issue.assignees.add(user);
    }
    issue.issued_by = this.clsService.get<User>('reqUser');
    await this.issueRepo.getEntityManager().persistAndFlush(issue);
    return issue;
  }
}
