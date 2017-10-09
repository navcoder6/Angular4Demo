import { TestBed, inject } from '@angular/core/testing';

import { BookStoreDataService } from './book-store-data.service';

describe('BookStoreDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookStoreDataService]
    });
  });

  it('should be created', inject([BookStoreDataService], (service: BookStoreDataService) => {
    expect(service).toBeTruthy();
  }));
});
