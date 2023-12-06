import { SetMetadata, UseGuards } from '@nestjs/common';
import { AuthorizeGuard } from '../guards/authorize.guard';

export function Authorize(microservice: string = null) {
  return (target: any, key: string, descr: any) => {
    SetMetadata('microservice', microservice)(target, key, descr);
    UseGuards(AuthorizeGuard)('target', key, descr);
  };
}
