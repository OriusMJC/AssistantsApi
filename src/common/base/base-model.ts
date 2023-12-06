import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { OnlyProps } from 'src/common/data/generics/object.generics';

export class BaseModel<This extends BaseModel = BaseModel<any>> {

    _id: ObjectId;


    createdAt!: Date;


    updatedAt!: Date;

    constructor(data: Partial<Omit<OnlyProps<This>, '_id' | 'createdAt' | 'updatedAt'>> = {}) {
        Object.assign(this, data);
    }

    // public validateObj(throwException?: boolean): ValidationError[] {
    //     const errors = validateSync(this);
    //     if (throwException && errors?.length) {
    //         const { constraints = {} } = errors.shift();
    //         const message = (Object.values(constraints).shift() || '');
    //         throw new BadRequestException({ message });
    //     }
    //     return errors;
    // }

    public static aggregations(): any[] {
        return [];
    }
}
