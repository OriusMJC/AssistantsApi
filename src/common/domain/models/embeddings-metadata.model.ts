
import { BaseModel } from '../../base/base-model';
import { Merchant } from './merchant.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb'
@Schema()
export class EmbeddingsMetadata extends BaseModel<EmbeddingsMetadata> {
    @Prop({ type: Number, default: 0 })
    vectorsCount: number;

    @Prop({ type: Boolean, default: true })
    automaticModeActivated: boolean;

    // @Prop({ ref: ObjectId, required: true })
    // merchant: ObjectId;
}

export const EmbeddingsMetadataSchema = SchemaFactory.createForClass(EmbeddingsMetadata);
