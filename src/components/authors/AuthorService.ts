import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, SaveOptions, UpdateQuery } from 'mongoose';
import { buildFindAllQuery, buildFindOneQuery } from '../../utils/app';
import Author, { AuthorModel } from './AuthorModel';

export default class AuthorService {
  public static async createOne(
    author: AuthorModel,
    options?: SaveOptions,
  ): Promise<DocumentType<AuthorModel>> {
    return await Author.create(author, options);
  }

  public static async createMany(
    authors: AuthorModel[],
    options?: SaveOptions,
  ): Promise<DocumentType<AuthorModel>[]> {
    return await Author.create(authors, options);
  }

  public static async findOne(
    conditions: FilterQuery<DocumentType<AuthorModel>>,
  ): Promise<DocumentType<AuthorModel>> {
    return await buildFindOneQuery(Author, conditions);
  }

  public static async findAll(
    conditions: FilterQuery<DocumentType<AuthorModel>>,
  ): Promise<{
    data: any;
    meta: {
      limit: number;
      offset: number;
      total: number;
    }
  }> {
    return await buildFindAllQuery(Author, conditions);
  }

  public static async update(
    conditions: FilterQuery<DocumentType<AuthorModel>>,
    data: UpdateQuery<DocumentType<AuthorModel>>,
  ): Promise<any> {
    return await Author.updateMany(conditions, data);
  }

  public static async remove(
    conditions: FilterQuery<DocumentType<AuthorModel>>,
  ): Promise<any> {
    return await Author.remove(conditions);
  }
}
