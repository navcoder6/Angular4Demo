import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder} from '@angular/forms';
import {BookStoreDataService} from './../../shared/services/book-store-data.service';
import {Book} from './../../shared/data/book.model';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {

  public bookForm:FormGroup;
  public genreList:string[]=['--Select--','Thriller', 'Leadership', 'Romantic', 'Fiction'];
  public formatList:string[]=['--Select--','pdf','online','book'];
  public IsInEditMode: boolean = false;
  public get formMode(){
    return this.IsInEditMode?'Update':'Add';
  }
  public book:Book;

  constructor(private bookStoreService: BookStoreDataService, formBuilder:FormBuilder) {
    this.bookForm = formBuilder.group({
      hideRequired: false,
      floatPlaceholder: 'auto',
    });
  }

  ngOnInit() {

  }

  public AddUpdateBook(){
    console.log('---->>');
    if(this.IsInEditMode){
      this.bookStoreService.updateBook(this.book);
    }else{
      this.bookStoreService.addBook(this.book);
    }
  }

  private getBookDetails(id:number){
    this.book = this.bookStoreService.getBook(id);
  }
}
