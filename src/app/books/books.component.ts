import { Component, ElementRef, ViewChild, OnInit,AfterViewInit } from '@angular/core';
import {BookStoreDataService} from './../shared/services/book-store-data.service';
import {Book} from './../shared/data/book.model';

import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import * as _ from 'lodash';
import {MatSelectionList} from '@angular/material';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit, AfterViewInit{

  private bookCollection: Book[];
  constructor(private bookDataService:BookStoreDataService) { }

      displayedColumns = ['title', 'author','isbn','publication','price','genre','format','delete','update'];
      filteredColumnList:string[];

      public get columnOptions(){
        return _.filter(this.displayedColumns,(column)=>{
          return (column!=='update' && column!=='delete');
        });
      }
      public get filteredColumns(){
        if(this.filteredColumnList && this.filteredColumnList.length>0){
          let columnsToShow:string[]=[];
          _.each(this.displayedColumns,(column)=>{
            let itemFound = _.find(this.filteredColumnList,(itemToFilter)=>{
                return itemToFilter===column;
            });
            if(itemFound){
              columnsToShow.push(itemFound);
            }
          });
          columnsToShow.push('delete');
          columnsToShow.push('update');
          return columnsToShow;
        }else{
          return this.displayedColumns;
      }
    }
      
      bookDatabase : BookDatabase;
      dataSource: BookDataSource | null;
    
      @ViewChild('filter') filter: ElementRef;
      // Used any as nativeElement is not supported and there is existing bug which is not supporting selectChange emitter
      @ViewChild('columnsToShow') columnsToShow: any; 

      ngOnInit() {
        this.bookDatabase = new BookDatabase(this.bookDataService.getBooks());
        this.dataSource = new BookDataSource(this.bookDatabase);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
              if (!this.dataSource) { return; }
              this.dataSource.filter = this.filter.nativeElement.value;
            });
      }

      ngAfterViewInit(){
        // Workaround found on stackoverflow otherwise the error Expression has changed after it was checked
        setTimeout(() => { this.columnsToShow.selectAll(); }, 0);
      }

      public columnSelected(){
        this.filteredColumnList=[];
        _.each(this.columnsToShow.selectedOptions.selected,
          (selectedItem:any)=>{
            this.filteredColumnList.push(selectedItem.value)
          });
    }

      public deleteBook(book:Book){
        this.bookDataService.deleteBook(book.Id);
        this.bookDatabase.deleteBook(book.Id);
        console.log(book);
      }
  }
    /** An book database that the data source uses to retrieve data for the table. */
    export class BookDatabase {
      constructor(books:Book[]){
       books.forEach((book)=>{
          this.addBook(book);
       });
      }
      addBook(book:Book) {
        const copiedData = this.data.slice();
        copiedData.push(book);
        this.dataChange.next(copiedData);
      }
      deleteBook(id:number) {
        const copiedData = this.data.slice();
        _.remove(copiedData, data=>data.Id===id);
        this.dataChange.next(copiedData);
      }
      /** Stream that emits whenever the data has been modified. */
      dataChange: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);
      get data(): Book[] { return this.dataChange.value; }
    }
    
    /**
     * Data source to provide what data should be rendered in the table. Note that the data source
     * can retrieve its data in any way. In this case, the data source is provided a reference
     * to a common data base, bookDatabase. It is not the data source's responsibility to manage
     * the underlying data. Instead, it only needs to take the data and send the table exactly what
     * should be rendered.
     */
    export class BookDataSource extends DataSource<any> {
      _filterChange = new BehaviorSubject('');
      get filter(): string { return this._filterChange.value; }
      set filter(filter: string) { this._filterChange.next(filter); }
    
      constructor(private _bookDatabase: BookDatabase) {
        super();
      }
    
      /** Connect function called by the table to retrieve one stream containing the data to render. */
      connect(): Observable<Book[]> {
        const displayDataChanges = [
          this._bookDatabase.dataChange,
          this._filterChange,
        ];
    
        return Observable.merge(...displayDataChanges).map(() => {
          return this._bookDatabase.data.slice().filter((item: Book) => {
            let searchStr = (item.Author).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) != -1;
          });
        });
      }
    
      disconnect() {}
    }
    
  // ngAfterViewInit(){
  //   this.bookCollection = this.bookDataService.getBooks();
  // }