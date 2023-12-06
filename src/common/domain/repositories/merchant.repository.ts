import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Merchant } from '../models/merchant.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class MerchantRepository {
    constructor(@InjectModel(Merchant.name) public model: Model<Merchant>) { }

    async findAll(): Promise<Merchant[]> {
        return await this.model.find();
    }
    async one(id: ObjectId): Promise<Merchant> {
        return await this.model.findById(id);
    }
}
