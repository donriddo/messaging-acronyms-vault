import { Request } from 'express';
import { DocumentType } from '@typegoose/typegoose';
import { AuthorModel } from '../components/authors/AuthorModel';

export interface IRequest extends Request {
  author: DocumentType<AuthorModel>;
}
