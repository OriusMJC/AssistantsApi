import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import OpenAI from 'openai';
import { CreateUserDTO } from 'src/dto/user/create-user.dto';
import { UpdateUserDTO } from 'src/dto/user/update-user.dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
  }

  async findAll(){
    const allUser = await this.userModel.find();
    return allUser;
  }

  async createUser(createUser:CreateUserDTO){
    const createdUser = await this.userModel.create(createUser);
    return createdUser;
  }

  async findOne(id:string){
    return this.userModel.findById(id);
  }

  async delete(id:string){
    return this.userModel.findByIdAndDelete(id);
  }

  async updated(id:string, user:UpdateUserDTO){
    return this.userModel.findByIdAndUpdate(id, user);
  }
}
