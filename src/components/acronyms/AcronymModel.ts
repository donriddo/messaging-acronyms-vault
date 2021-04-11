import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';

import { AuthorModel } from '../authors/AuthorModel';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
})
export class AcronymModel {
  @prop({ required: true })
  public key!: string;

  @prop({ required: true })
  public value!: string;

  @prop({ required: true, ref: 'Author' })
  public author!: Ref<AuthorModel>;
}

export default getModelForClass(AcronymModel);
