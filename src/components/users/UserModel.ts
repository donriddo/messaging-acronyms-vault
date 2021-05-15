import * as bcrypt from 'bcrypt';
import {
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';
import validator from 'validator';
import { hashPassword } from '../../utils/app';

export enum UserTypes {
  regular,
  admin,
}

@modelOptions({
  schemaOptions: {
    toJSON: {
      virtuals: true,
      getters: true,
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    toObject: { virtuals: true, getters: true },
    timestamps: true,
  },
})
@pre<UserSchema>('save', function (next) {
  if (this.password) {
    this.password = hashPassword(this.password);
  }

  next();
})
@index({ email: 1, isDeleted: 1 }, { unique: true, sparse: true })
export class UserSchema {
  @prop({ default: UserTypes.regular, enum: UserTypes })
  public type?: string;

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

  @prop({ minlength: 8, hide: true, hideJSON: true })
  public password?: string;

  @prop()
  public firstName?: string;

  @prop()
  public lastName?: string;
}

export class UserModel extends UserSchema {
  /**
   * Instance Methods
   */
  public comparePassword(password: string, cb?: Function) {
    if (!this.password) {
      return cb(new Error('Account not activated yet'), false);
    }

    if (!cb) {
      return bcrypt.compareSync(password, this.password);
    }

    bcrypt.compare(password, this.password, (err, isMatch) => {
      cb(err, isMatch);
    });
  }
}

export default getModelForClass(
  UserModel,
  { options: { customName: 'User' } },
);
