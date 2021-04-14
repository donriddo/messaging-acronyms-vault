import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, SaveOptions, UpdateQuery } from 'mongoose';
import { buildFindAllQuery, buildFindOneQuery } from '../../utils/app';
import Acronym, { AcronymModel } from './AcronymModel';

export default class AcronymService {
  public static async createOne(
    acronym: AcronymModel,
    options?: SaveOptions,
  ): Promise<AcronymModel> {
    return await Acronym.create(acronym, options);
  }

  public static async createMany(
    acronyms: AcronymModel[],
    options?: SaveOptions,
  ): Promise<AcronymModel[]> {
    return await Acronym.create(acronyms, options);
  }

  public static async findOne(
    conditions: FilterQuery<DocumentType<AcronymModel>>,
  ): Promise<DocumentType<AcronymModel>> {
    return await buildFindOneQuery(Acronym, conditions);
  }

  public static async findAll(
    conditions: FilterQuery<DocumentType<AcronymModel>>,
  ): Promise<{
    data: any;
    meta: {
      limit: number;
      offset: number;
      total: number;
    }
  }> {
    return !conditions.$search
      ? await buildFindAllQuery(Acronym, conditions)
      : await buildFindAllQuery(Acronym, conditions, true);
  }

  public static async update(
    conditions: FilterQuery<DocumentType<AcronymModel>>,
    data: UpdateQuery<DocumentType<AcronymModel>>,
  ): Promise<any> {
    return await Acronym.updateMany(conditions, data);
  }

  public static async remove(
    conditions: FilterQuery<DocumentType<AcronymModel>>,
  ): Promise<any> {
    return await Acronym.remove(conditions);
  }
}
