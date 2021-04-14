import {
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';
import validator from 'validator';

import { generateApiKey } from '../../utils/app';

@modelOptions({
  schemaOptions: {
    toJSON: {
      virtuals: true,
      getters: true,
      transform(doc, ret) {
        delete ret.apiKey;
        return ret;
      },
    },
    toObject: { virtuals: true, getters: true },
    timestamps: true,
  },
})
@pre<AuthorModel>('save', function (next) {
  if (this.isNew) {
    this.apiKey = generateApiKey(this.email);
  }
  next();
})
@index({ email: 1, isDeleted: 1 }, { unique: true, sparse: true })
export class AuthorModel {
  @prop({
    required: true, lowercase: true,
    validate: {
      validator: (v) => {
        return validator.isEmail(v);
      },
      message: '{VALUE} is not a valid email',
    },
  })
  public email!: string;

  @prop()
  public apiKey?: string;

  @prop()
  public name?: string;
}

export default getModelForClass(AuthorModel);
