import Joi from "joi";

export const bookValidation = Joi.object<BookValidation>({
  name: Joi.string().required(),
  tome: Joi.number().required(),
  author: Joi.string().required(),
  price: Joi.number().required(),
  rating: Joi.number().required(),
});

export interface BookValidation {
  name: string;
  tome: number;
  author: string;
  price: number;
  rating: number;
}

export const listBooksValidation = Joi.object<ListBooksValidation>({
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).optional(),
});

export interface ListBooksValidation {
  page?: number;
  limit?: number;
}

export interface DeleteBookValidation {
  id: number;
}

export const deleteBookValidation = Joi.object<DeleteBookValidation>({
  id: Joi.number().required(),
});

export const updateBookValidation = Joi.object<UpdateBookRequest>({
  id: Joi.number().required(),
  price: Joi.number().min(1).optional(),
});

export interface UpdateBookRequest {
  id: number;
  price?: number;
}
