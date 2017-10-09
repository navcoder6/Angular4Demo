import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Book } from './../data/book.model';
import * as _ from 'lodash';

@Injectable()
export class BookStoreDataService {
  public booksCollection: Book[];
  constructor(private http: Http) {
    this.booksCollection = [{
      "Id": 1,
      "Title": "Monk Who Sold His Ferrari",
      "Author": "Robin Sharma",
      "ISBN": "123456789",
      "Publication": new Date(),
      "Publisher": "TMH",
      "Price": 1900,
      "Genre": "Leadership",
      "Format": "pdf"
    },

    {
      "Id": 2,
      "Title": "The Saint",
      "Author": "Robin Sharma",
      "ISBN": "12345678912",
      "Publication": new Date(),
      "Publisher": "Jaico",
      "Price": 2900,
      "Genre": "Leadership",
      "Format": "pdf"
    },
    {
      "Id": 3,
      "Title": "Night At Call Center",
      "Author": "Chetan Bhagat",
      "ISBN": "24123456789",
      "Publication": new Date(),
      "Publisher": "TMH",
      "Price": 1900,
      "Genre": "Fiction",
      "Format": "online"
    }];
  }

  public getBooks() {
    return this.booksCollection;
  }

  public getBook(id: number): Book {
    return _.find(this.booksCollection, book => book.Id === id);
  }

  public deleteBook(id: number) {
    _.remove(this.booksCollection, book => book.Id === id);
  }

  public updateBook(book: Book) {
    let indexOfBookToUpdate = _.findIndex(this.booksCollection, item => item.Id === book.Id);
    if (indexOfBookToUpdate >= 0) {
      this.booksCollection[indexOfBookToUpdate] = book;
    }
  }

  public addBook(book: Book) {
    let maxBookId = _.maxBy(this.booksCollection, 'Id');
    book.Id = maxBookId.Id + 1;
    this.booksCollection.push(book);
  }
}
