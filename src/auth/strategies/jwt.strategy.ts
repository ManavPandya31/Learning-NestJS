import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

//Passport Is an Authentication Library...

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,//If Token Expired → Reject Request...

      secretOrKey: process.env.JWT_ACCESS_SECRET as string,
    });
  }

  //Decode The Token For Verification...
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}