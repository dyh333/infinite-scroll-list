import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/observable';

import { InfiniteScrollComponent } from '../components/infinite-scroll.component';
import { InfiniteScrollService } from '../services/infinite-scroll.service';

@Component({
  selector: 'app-infinite-scroll-list',
  templateUrl: './infinite-scroll-list.component.html',
  styleUrls: ['./infinite-scroll-list.component.scss'],
  providers: [InfiniteScrollService]
})
export class InfiniteScrollListComponent extends InfiniteScrollComponent<string>
  implements OnInit {
  constructor(private infiniteScrollService: InfiniteScrollService) {
    super();
  }

  ngOnInit() {
    this.itemHeight = 40;
    this.numberOfItems = 10;
  }

  appendData(page: number): Observable<string> {
    return this.infiniteScrollService.loadByPage(page);
  }
}
