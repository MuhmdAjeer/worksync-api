import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/User.entity';
import { AuthService } from 'src/services/auth.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private authSvc: AuthService,
    private clsService: ClsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_KEY'),
    });
  }

  async validate(decodedPayload: User): Promise<User> {
    const user = await this.authSvc.findOne(decodedPayload.id);
    // if (user.deleted_at) {
    //   throw new UserDeletedException();
    // }
    this.clsService.set('reqUser', user);
    return user;
  }
}
