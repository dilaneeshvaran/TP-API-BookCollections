import express, { Request, Response } from "express";
import {
  bookValidation,
  listBooksValidation,
  deleteBookValidation,
  updateBookValidation,
} from "./validators/books-validator";
import { generateValidationErrorMessage } from "./validators/generate-validation-message";
import { AppDataSource } from "../database/database";
import { Books } from "../database/entities/book";
import { BookUsecase } from "../domain/book-usecase";

export const initRoutes = (app: express.Express) => {
  app.get("/health", (req: Request, res: Response) => {
    res.send({ message: "hello world" });
  });

  app.post("/collection", async (req: Request, res: Response) => {
    const validation = bookValidation.validate(req.body);

    if (validation.error) {
      res
        .status(400)
        .send(generateValidationErrorMessage(validation.error.details));
      return;
    }

    const bookRequest = validation.value;
    const productRepo = AppDataSource.getRepository(Books);
    try {
      const productCreated = await productRepo.save(bookRequest);
      res.status(201).send(productCreated);
    } catch (error) {
      res.status(500).send({ error: "Internal error" });
    }
  });

  app.patch("/collections/:id", async (req: Request, res: Response) => {
    const validation = updateBookValidation.validate({
      ...req.params,
      ...req.body,
    });

    if (validation.error) {
      res
        .status(400)
        .send(generateValidationErrorMessage(validation.error.details));
      return;
    }

    const updateBookReq = validation.value;

    try {
      const bookUsecase = new BookUsecase(AppDataSource);
      const updatedBook = await bookUsecase.updateBook(updateBookReq.id, {
        ...updateBookReq,
      });
      if (updatedBook === null) {
        res.status(404).send({
          error: `books collection ${updateBookReq.id} not found`,
        });
        return;
      }
      res.status(200).send(updatedBook);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal error" });
    }
  });

  app.get("/collections", async (req: Request, res: Response) => {
    const validation = listBooksValidation.validate(req.query);

    if (validation.error) {
      res
        .status(400)
        .send(generateValidationErrorMessage(validation.error.details));
      return;
    }

    const listBookReq = validation.value;
    let limit = 20;
    if (listBookReq.limit) {
      limit = listBookReq.limit;
    }
    const page = listBookReq.page ?? 1;

    try {
      const bookUsecase = new BookUsecase(AppDataSource);
      const listBooks = await bookUsecase.listBook({
        ...listBookReq,
        page,
        limit,
      });
      res.status(200).send(listBooks);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal error" });
    }
  });

  app.delete("/collections", async (req: Request, res: Response) => {
    const validation = deleteBookValidation.validate(req.body);

    if (validation.error) {
      res
        .status(400)
        .send(generateValidationErrorMessage(validation.error.details));
      return;
    }

    try {
      const bookUsecase = new BookUsecase(AppDataSource);
      const deletedBook = await bookUsecase.deleteBookCollection(req.body.id);

      if (deletedBook) {
        res.status(200).send({
          message: "Book Collection deleted successfully",
          book: deletedBook,
        });
      } else {
        res.status(404).send({ message: "Book collection not found" });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  });
};
