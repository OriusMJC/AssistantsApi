import { Injectable } from '@nestjs/common';
import { EmbeddingsMetadata } from '../models/embeddings-metadata.model';
import { EmbeddingsMetadataInput } from '../input/embeddings-metadata.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EmbeddingsMetadataRepository {
    constructor(@InjectModel(EmbeddingsMetadata.name) public model: Model<EmbeddingsMetadata>) { }

    async create(createCatDto: EmbeddingsMetadataInput): Promise<EmbeddingsMetadata> {
        const createdCat = await this.model.create(createCatDto);
        return createdCat.save();
    }

    async all(): Promise<EmbeddingsMetadata[]> {
        return this.model.find();
    }
}

