import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { UuidParam } from 'src/decorators';
import {
  AddCommentDto,
  CommentDto,
  UpdateCommentDto,
} from 'src/dtos/Issue.dto';
import { Comment } from 'src/entities/Comment.entity';
import { JwtAuthGuard } from 'src/guards';
import { IssueService } from 'src/services/issue.service';

@Controller('issue/:id/comment')
export class CommentController {
  constructor(private issueService: IssueService) {}

  @UseGuards(JwtAuthGuard)
  @ApiExtraModels(CommentDto)
  @Get()
  async getComments(@UuidParam('id') issueId: string) {
    return this.issueService.getComments(issueId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addComment(
    @UuidParam('id') issueId: string,
    @Body() body: AddCommentDto,
  ) {
    return this.issueService.addComment(issueId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:commentId')
  async updateComment(
    @UuidParam('commentId') commentId: string,
    @Body() body: UpdateCommentDto,
  ) {
    return this.issueService.updateComment(commentId, body);
  }
}
