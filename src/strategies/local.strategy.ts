import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { User } from 'src/entities/User.entity';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger('strategy');
  constructor(
    private authService: AuthService,
    private clsService: ClsService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(username, password);
    this.logger.log({ userdd: user });
    if (!user.verified_at) {
      throw new NotFoundException();
    }
    // if (user.status === UserStatus.Disabled) {
    //   throw new UserDisabledException();
    // }
    // if (user.deleted_at) {
    //   throw new UserDeletedException();
    // }
    this.clsService.set('reqUser', user);
    return user;
  }
}
