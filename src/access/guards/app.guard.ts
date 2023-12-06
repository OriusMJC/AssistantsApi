import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AppGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const type: string = ctx.getType();

    if (type === 'http') {
      const { headers, params, query } = ctx.switchToHttp().getRequest();

      const key = headers['app-key'] || params['app-key'] || query['app-key'];
      if (!process.env.APP_KEY || key != process.env.APP_KEY) {
        throw new UnauthorizedException('app-key invalid');
      }
    } else {
      throw new UnauthorizedException('app-key not provided');
    }
    return true;
  }
}
