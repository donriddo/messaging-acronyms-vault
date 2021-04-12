import { getModelForClass, modelOptions, plugin, prop, Ref } from '@typegoose/typegoose';
import mongooseFuzzySearching from 'mongoose-fuzzy-searching';

import { AuthorModel } from '../authors/AuthorModel';

@plugin(mongooseFuzzySearching, { fields: ['key', 'value'] })
@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    timestamps: true,
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
