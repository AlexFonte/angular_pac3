import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  show = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select('auth').subscribe((auth) => {
      if (auth.loaded) {
        this.show = false;
      } else if (auth.loading) {
        this.show = true;
      }
    });

    this.store.select('user').subscribe((user) => {
      if (user.loaded) {
        this.show = false;
      } else if (user.loading) {
        this.show = true;
      }
    });

    this.store.select('categories').subscribe((categories) => {
      if (categories.loaded) {
        this.show = false;
      } else if (categories.loading) {
        this.show = true;
      }
    });

    this.store.select('posts').subscribe((posts) => {
      if (posts.loaded) {
        this.show = false;
      } else if (posts.loading) {
        this.show = true;
      }
    });
  }
}
