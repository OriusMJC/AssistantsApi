import { ArgumentsHost, CanActivate, Catch, ExecutionContext, HttpException, HttpStatus, Injectable, RpcExceptionFilter, UnauthorizedException, UseFilters } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
@Injectable()
export class AuthorizeGuard {

    private reflector: Reflector = new Reflector()

    async canActivate(context: ExecutionContext): Promise<boolean> {
        //const name = this.reflector.get("microservice", context.getHandler())
        const args = context.getArgs()[0];
        try {
            if (!args.key) throw new HttpException('App-key not provided', 401);
            if (args.key != process.env.APP_KEY) throw new HttpException('App-key invalid', 401);
        } catch (e) {
            throw new UnauthorizedException(e.message)
        }
        return true;
    }

}