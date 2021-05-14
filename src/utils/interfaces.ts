import { Request } from 'express';
import { DocumentType } from '@typegoose/typegoose';
import { UserModel } from '../components/users/UserModel';

export interface IRequest extends Request {
  user: DocumentType<UserModel>;
}
