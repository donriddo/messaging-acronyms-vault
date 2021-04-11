import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, SaveOptions, UpdateQuery } from 'mongoose';
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
    return await Acronym.findOne(conditions);
  }

  public static async findAll(
    conditions: FilterQuery<DocumentType<AcronymModel>>,
  ): Promise<DocumentType<AcronymModel>[]> {
    return await Acronym.find(conditions);
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
