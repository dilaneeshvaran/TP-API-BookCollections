import { DataSource } from "typeorm";
import { Books } from "../database/entities/book";

export interface ListBook {
  limit: number;
  page: number;
}

export interface UpdateBookParams {
  price?: number;
  tome?: number;
  rating?: number;
}

export class BookUsecase {
  constructor(private readonly db: DataSource) {}

  async listBook(
    listBooks: ListBook
  ): Promise<{ books: Books[]; totalCount: number }> {
    console.log(listBooks);
    const query = this.db.createQueryBuilder(Books, "books");

    query.skip((listBooks.page - 1) * listBooks.limit);
    query.take(listBooks.limit);

    const [books, totalCount] = await query.getManyAndCount();
    return {
      books,
      totalCount,
    };
  }
  async deleteBookCollection(id: number): Promise<Books | null> {
    const repo = this.db.getRepository(Books);
    const productFound = await repo.findOneBy({ id });

    if (!productFound) return null;

    await repo.remove(productFound);
    return productFound;
  }

  async updateBook(
    id: number,
    { price, tome, rating }: UpdateBookParams
  ): Promise<Books | null> {
    const repo = this.db.getRepository(Books);
    const bookfound = await repo.findOneBy({ id });
    if (bookfound === null) return null;

    if (price) {
      bookfound.price = price;
    }

    if (tome) {
      bookfound.tome = tome;
    }

    if (rating) {
      bookfound.rating = rating;
    }

    const bookUpdate = await repo.save(bookfound);
    return bookUpdate;
  }
}
