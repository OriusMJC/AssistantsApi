import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmbeddingsMetadata, EmbeddingsMetadataSchema } from './domain/models/embeddings-metadata.model';
import { Merchant, MerchantSchema } from './domain/models/merchant.model';
import { EmbeddingsMetadataRepository } from './domain/repositories/embeddings-metadata.repository';
import { MerchantRepository } from './domain/repositories/merchant.repository';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: EmbeddingsMetadata.name, schema: EmbeddingsMetadataSchema },
            { name: Merchant.name, schema: MerchantSchema }
        ])
    ],
    controllers: [],
    providers: [
        EmbeddingsMetadataRepository,
        MerchantRepository
    ],
    exports: [
        EmbeddingsMetadataRepository,
        MerchantRepository
    ]
})
export class commonModule { }
