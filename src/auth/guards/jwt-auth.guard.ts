//Without Guard AnyOne Can Access Route , With Guard Only Login User Can Access...

import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}