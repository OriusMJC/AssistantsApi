import { Global, Module, OnModuleInit } from "@nestjs/common";
import { AuthorizeGuard } from "./guards/authorize.guard";
import { AppGuard } from "./guards/app.guard";

@Global()
@Module({
  imports: [
  ],
  providers: [
    AuthorizeGuard,
    AppGuard
  ],
  exports: [AuthorizeGuard,AppGuard],
  controllers: []
})
export class AccessModule implements OnModuleInit {
  async onModuleInit() {

  }
}
