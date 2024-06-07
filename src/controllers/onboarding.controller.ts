import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { OnboardDto } from 'src/dtos/CreateWorkspaceDto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { OnboardingService } from 'src/services/onboarding.service';
@Controller('onboarding')
export class OnboardingController {
  constructor(private onboardingSvc: OnboardingService) {}

  private readonly logger = new Logger('onboarding controller');

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async onboardUser(@Body() onboardDto: OnboardDto) {
    return await this.onboardingSvc.onboardUser(onboardDto);
  }
}
