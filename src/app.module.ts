import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { User } from './entities/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './services/auth.service';
import { ClsModule } from 'nestjs-cls';
import { OTP } from './entities/Otp.entity';
import { UploadController } from './controllers/upload.controller';
import { WorkspaceController } from './controllers/workspace.controller';
import { ProjectsController } from './controllers/project.controller';
import { UploadService } from './services/upload.service';
import { WorkspaceService } from './services/workspace.service';
import { ProjectService } from './services/project.service';
import { Workspace } from './entities/Workspace.entity';
import { WorkspaceMember } from './entities/WorkspaceMember.entity';
import { Invitation } from './entities/Invitation.entity';
import { FileUpload } from './entities/FileUpload.entity';
import { MailService } from './services/mail.service';
import { OnboardingController } from './controllers/onboarding.controller';
import { OnboardingService } from './services/onboarding.service';
import { Project } from './entities/Project.entity';
import { Issue } from './entities/Issue.entity';
import { IssueController } from './controllers/issue.controller';
import { IssueService } from './services/issue.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { InviteService } from './services/invite.service';
import { InvitationController } from './controllers/invitation.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { IssueState } from './entities/IssueState.entity';
import { ProjectMember } from './entities/ProjectMember.entity';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    MikroOrmModule.forRoot(config),
    MikroOrmModule.forFeature({
      entities: [
        User,
        OTP,
        Workspace,
        WorkspaceMember,
        Invitation,
        FileUpload,
        Project,
        Issue,
        IssueState,
        ProjectMember,
      ],
    }),

    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        const tokenExpiry =
          configService.get('NODE_ENV') === 'development' ? '100d' : '4h';
        return {
          secret: configService.getOrThrow('JWT_KEY'),
          signOptions: { expiresIn: tokenExpiry },
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    ConfigModule.forRoot(),
    ClsModule.forRoot({ middleware: { mount: true } }),
    AuthModule,
  ],
  controllers: [
    AppController,
    OnboardingController,
    UploadController,
    WorkspaceController,
    ProjectsController,
    IssueController,
    UserController,
    InvitationController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    IssueService,
    AppService,
    OnboardingService,
    JwtStrategy,
    LocalStrategy,
    AuthService,
    UploadService,
    WorkspaceService,
    ProjectService,
    MailService,
    UserService,
    InviteService,
  ],
})
export class AppModule {}
