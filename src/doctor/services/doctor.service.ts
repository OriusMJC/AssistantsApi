import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { Doctor , DoctorSchema } from 'src/schemas/doctor.schema';

@Injectable()
export class DoctorService {
  // private apiSession: OpenAI;
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<Doctor>) {
    // if (!process.env.OPENAI_API_KEY) {
    //   throw Error(
    //     '"OpenAI API key not configured, please follow instructions in README.md"',
    //   );
    // }
    // this.apiSession = new OpenAI({
    //   apiKey: process.env.OPENAI_API_KEY,
    // });
  }

  async findAll(){
    const allDoctors = await this.doctorModel.find();
    return allDoctors;
  }

  async createDoctor(createDoctor:any){
    const createdDoctor = await this.doctorModel.create(createDoctor);
    return createdDoctor;
  }

  async findOne(id:string){
    return this.doctorModel.findById(id);
  }

  async delete(id:string){
    return this.doctorModel.findByIdAndDelete(id);
  }

  async updated(id:string, assistant:any){
    return this.doctorModel.findByIdAndUpdate(id, assistant);
  }

  
}
