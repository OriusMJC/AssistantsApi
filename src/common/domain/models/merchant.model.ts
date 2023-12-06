import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseModel } from "../../base/base-model";

@Schema()
export class Merchant extends BaseModel<Merchant> {

    @Prop({ type: String })
    name: string;
}


export const MerchantSchema = SchemaFactory.createForClass(Merchant);