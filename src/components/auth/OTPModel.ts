import {
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Ref,
} from '@typegoose/typegoose';

import { UserSchema } from '../users/UserModel';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    timestamps: true,
  },
})
@pre<OTPSchema>('validate', function (next) {
  this.token = this.token || Math.random().toString(10).substr(10, 7);
  this.expiryDate = this.expiryDate || new Date(Date.now() + 900000);
  next();
})
export class OTPSchema {
  @prop({ required: true })
  public token!: string;

  @prop()
  public expiryDate?: Date;

  @prop({ required: true })
  public action!: string;

  @prop({ ref: 'User', required: true })
  public user!: Ref<UserSchema>;
}

export class OTPModel extends OTPSchema {
  /**
   * Instance Methods
   */
}

export default getModelForClass(
  OTPModel,
  { options: { customName: 'OTP' } },
);
