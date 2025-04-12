import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import * as PostsAction from '../../actions';
import { PostDTO } from '../../models/post.dto';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0.2 })),
      transition('void <=> *', animate('800ms ease-in-out')),
    ]),
  ],
})
export class PostsListComponent implements AfterViewInit {
  // posts: PostDTO[];

  displayedColumns: string[] = [
    'id',
    'title',
    'description',
    'num_likes',
    'num_dislikes',
    'actions',
  ];
  dataSource = new MatTableDataSource<PostDTO>([]);

  private userId: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private store: Store<AppState>) {
    this.userId = '';
    // this.posts = new Array<PostDTO>();

    this.store.select('auth').subscribe((auth) => {
      if (auth.credentials.user_id) {
        this.userId = auth.credentials.user_id;
      }
    });

    this.store.select('posts').subscribe((posts) => {
      // this.posts = posts.posts;
      this.dataSource.data = posts.posts;
    });

    this.loadPosts();
  }

  private loadPosts(): void {
    if (this.userId) {
      this.store.dispatch(
        PostsAction.getPostsByUserId({ userId: this.userId })
      );
    }
  }

  createPost(): void {
    this.router.navigateByUrl('/user/post/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/post/' + postId);
  }

  deletePost(postId: string): void {
    // show confirmation popup
    let result = confirm('Confirm delete post with id: ' + postId + ' .');
    if (result) {
      this.store.dispatch(PostsAction.deletePost({ postId: postId }));
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
