import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from 'src/dto/user/create-user.dto';
import { UpdateUserDTO } from 'src/dto/user/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id:string) {
    return this.userService.findOne(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id:string) {
    return this.userService.delete(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id:string, @Body() body: UpdateUserDTO ) {
    return await this.userService.updated(id, body);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async getHello(@Body() body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }
}
