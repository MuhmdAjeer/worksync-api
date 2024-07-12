import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import * as nodemailer from 'nodemailer';
import * as React from 'react';
import { ReactElement } from 'react';
import SendOTP from 'src/views/templates/SendOTP';
import WorkspaceInvitation, {
  InviteToWorkspaceProps,
} from 'src/views/templates/WorkspaceInvitation';

interface SendMailConfiguration {
  email: string;
  subject: string;
  text?: string;
  template: any;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService:ConfigService) {
    this.transporter = nodemailer.createTransport(
      {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: configService.getOrThrow('MAILER_MAIL'),
          pass: configService.getOrThrow('MAILER_PASSWORD'),
        },
      },
      {
        from: {
          name: 'Worksync',
          address: 'Worksync.dev',
        },
      },
    );
  }
  generateHtml = (template: ReactElement) => {
    return render(template);
  };
  async sendMail({ email, subject, template }: SendMailConfiguration) {
    await this.transporter.sendMail({
      to: email,
      subject,
      html: template,
    });
  }

  async sendOTPMail({ email, code }: { email: string; code: string }) {
    const template = render(<SendOTP code={code} />);
    await this.sendMail({ email, template, subject: 'OTP for verification' });
  }

  async inviteToWorkspace({
    email,
    ...props
  }: InviteToWorkspaceProps & { email: string }) {
    const template = render(<WorkspaceInvitation {...props} />);
    await this.sendMail({ email, template, subject: 'Workspace Invitation' });
  }
}
