import { BaseModel } from 'src/common/base/base-model';
import { BaseInput } from 'src/common/base/base-input';

// MODEL

// #### Input Parser ####
export const ParserMetadata = Symbol('ParserMetadata');
export const ParserModel = Symbol('ParserModel');
export type ParserType = 'image' | 'ref';

export type RefParserOptions = {
  model: typeof BaseModel;
};
export type GeneratedParserOptions = {
  generator: (value?: any) => any | Promise<any>;
};

// #### Repository ####
export const RepositoryMetadata = Symbol('ServiceMetadata');
export type ServiceMetadata<
  MC extends typeof BaseModel = typeof BaseModel,
  IC extends typeof BaseInput = typeof BaseInput
> = {
  constructors: {
    model: MC;
    input: IC;
  };
};


export abstract class AbstractPaginateRepository<T extends BaseModel, Input extends object> {
  public static [RepositoryMetadata]: ServiceMetadata;
}
