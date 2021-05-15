import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, SaveOptions, UpdateQuery } from 'mongoose';
import { buildFindAllQuery, buildFindOneQuery } from '../../utils/app';
import User, { UserModel, UserSchema } from './UserModel';

export default class UserService {
  public static async createOne(
    user: UserSchema,
    options?: SaveOptions,
  ): Promise<DocumentType<UserModel>> {
    return await User.create(user, options);
  }

  public static async createMany(
    users: UserModel[],
    options?: SaveOptions,
  ): Promise<DocumentType<UserModel>[]> {
    return await User.create(users, options);
  }

  public static async findOne(
    conditions: FilterQuery<DocumentType<UserModel>>,
  ): Promise<DocumentType<UserModel>> {
    return await buildFindOneQuery(User, conditions);
  }

  public static async findAll(
    conditions: FilterQuery<DocumentType<UserModel>>,
  ): Promise<{
    data: any;
    meta: {
      limit: number;
      offset: number;
      total: number;
    }
  }> {
    return await buildFindAllQuery(User, conditions);
  }

  public static async update(
    conditions: FilterQuery<DocumentType<UserModel>>,
    data: UpdateQuery<DocumentType<UserModel>>,
  ): Promise<any> {
    return await User.updateMany(conditions, data);
  }

  public static async remove(
    conditions: FilterQuery<DocumentType<UserModel>>,
  ): Promise<any> {
    return await User.deleteOne(conditions);
  }
}
