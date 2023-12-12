import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateThreadDTO } from 'src/dto/thread/create-thread.dto';
import { Thread } from 'src/schemas/thread.schema';

@Injectable()
export class ThreadService {
  constructor(@InjectModel(Thread.name) private threadModel: Model<Thread>) {
  }

  async findAll(){
    const allThread = await this.threadModel.find();
    return allThread;
  }

  async createThread(createThread:CreateThreadDTO){
    const createdThread = await this.threadModel.create(createThread);
    return createdThread;
  }

  async findOne(id:string){
    return this.threadModel.findById(id);
  }

  async delete(id:string){
    return this.threadModel.findByIdAndDelete(id);
  }
}
