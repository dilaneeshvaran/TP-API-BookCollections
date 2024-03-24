import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Books {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  tome: number;

  @Column()
  author: string;

  @Column()
  price: number;

  @Column()
  rating: number;

  constructor(
    id: number,
    name: string,
    tome: number,
    author: string,
    price: number,
    rating: number
  ) {
    this.id = id;
    this.name = name;
    this.tome = tome;
    this.author = author;
    this.price = price;
    this.rating = rating;
  }
}
