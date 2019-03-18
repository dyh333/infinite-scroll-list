import { Observable } from 'rxjs/observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import {
  distinct,
  filter,
  map,
  debounceTime,
  tap,
  flatMap
} from 'rxjs/operators';

export abstract class InfiniteScrollComponent<T> {
  private cache = [];
  protected itemHeight: number;
  protected numberOfItems: number;
  protected isLoading = false;
  protected isEnding = false;

  get itemResults(): Observable<T> {
    return this.itemResults$;
  }

  // 手动决定加载第几页数据的流
  private pageByManual$ = new BehaviorSubject(1);
  // scroll 事件的流
  private pageByScroll$ = fromEvent(window, 'scroll').pipe(
    map(() => window.scrollY),
    filter(
      current => current >= document.body.clientHeight - window.innerHeight
    ),
    debounceTime(200),
    distinct(),
    map(y =>
      Math.ceil(
        (y + window.innerHeight) / (this.itemHeight * this.numberOfItems)
      )
    )
  );
  // resize 事件的流
  private pageByResize$ = fromEvent(window, 'resize').pipe(
    debounceTime(200),
    map(_ =>
      Math.ceil(
        (window.innerHeight + document.body.scrollTop) /
          (this.itemHeight * this.numberOfItems)
      )
    )
  );
  // 合并上述三个页码流
  private pageToLoad$ = merge(
    this.pageByManual$,
    this.pageByScroll$,
    this.pageByResize$
  ).pipe(distinct(), filter(page => this.cache[page - 1] === undefined));

  // 基于pageToLoad$流来创建一个新的流，它将包含无限滚动加载列表中的数据
  private itemResults$ = this.pageToLoad$.pipe(
    tap(_ => (this.isLoading = true)),
    flatMap((page: number) => {
      return this.appendData(page).pipe(
        map((resp: any) => {
          // ONLY FOR TEST
          const result = resp.results;
          if (page >= 10) {
            return [];
          } else {
            return result;
          }
        }),
        tap((resp: any) => {
          this.isLoading = false;

          if (resp && resp.length > 0) {
            this.cache[page - 1] = resp;
            if (
              this.itemHeight * this.numberOfItems * page <
              window.innerHeight
            ) {
              this.pageByManual$.next(page + 1);
            }
          } else {
            this.isEnding = true;
          }
        })
      );
    }),
    map(() => {
      return this.cache.reduce((a, b) => a.concat(b), []);
    })
  );

  abstract appendData(page: number): Observable<T>;
}
