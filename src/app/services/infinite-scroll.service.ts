import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class InfiniteScrollService {
  constructor(private httpClient: HttpClient) {}

  loadByPage(page: number, pageSize: number): Observable<any> {
    return this.httpClient
    .get(`https://swapi.co/api/people?page=${page}`);
  }
}
