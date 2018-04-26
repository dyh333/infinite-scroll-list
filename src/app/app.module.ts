import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { AppComponent } from './app.component';
import { InfiniteScrollListComponent } from './infinite-scroll-list/infinite-scroll-list.component';

@NgModule({
  declarations: [AppComponent, InfiniteScrollListComponent],
  imports: [BrowserModule, HttpClientModule, NgZorroAntdModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
