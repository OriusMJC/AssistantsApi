
import { ObjectId } from 'mongodb';
import { BaseInput } from 'src/common/base/base-input';

export class EmbeddingsMetadataInput extends BaseInput<EmbeddingsMetadataInput>{

    vectorsCount: number;

    automaticModeActivated: boolean;

    merchant: ObjectId;

}
