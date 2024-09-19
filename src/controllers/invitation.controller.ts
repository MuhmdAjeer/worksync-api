import { Get, Query } from '@nestjs/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import {
  AcceptInvitationsDto,
} from 'src/dtos/invitation.dto';
import { JwtAuthGuard } from 'src/guards';
import { InviteService } from 'src/services/invite.service';

@Controller('invitations')
export class InvitationController {
  constructor(private inviteService: InviteService) {}
  @UseGuards(JwtAuthGuard)
  @Post('/accept')
  async acceptInvite(@Body() acceptInvitationDto: AcceptInvitationsDto) {
    await this.inviteService.acceptInvites(acceptInvitationDto);
  }
}
