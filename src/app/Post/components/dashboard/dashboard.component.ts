import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartConfiguration, ChartData } from 'chart.js';
import { AppState } from 'src/app/app.reducers';
import * as PostsAction from '../../actions';
import { PostDTO } from '../../models/post.dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  posts: PostDTO[];
  numLikes: number;
  numDislikes: number;
  isChartLoaded: boolean = false;

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      y: {
        ticks: {
          color: '#000',
        },
        title: {
          display: true,
          text: 'Totals',
          font: { size: 16 },
        },
        max: 0,
      },
      x: {
        ticks: {
          stepSize: 1,
          color: '#000',
        },
        title: {
          display: true,
          text: 'Cantidad',
          color: '#000',
          font: { size: 16 },
        },
        max: 0,
      },
    },

    plugins: {
      title: {
        display: true,
        text: 'Total Likes & Dislikes',
        font: { size: 24, weight: 'bold' },
        color: '#000',
      },
    },
  };

  barChartType = 'bar' as const;

  barChartData: ChartData<'bar'> = {
    labels: ['Totals'],
    datasets: [
      { data: [0], label: 'Likes' },
      { data: [0], label: 'Dislikes' },
    ],
  };

  constructor(private store: Store<AppState>) {
    this.isChartLoaded = false;
    this.posts = new Array<PostDTO>();
    this.numLikes = 0;
    this.numDislikes = 0;

    this.store.select('posts').subscribe((posts) => {
      this.posts = posts.posts;
      this.numLikes = 0;
      this.numDislikes = 0;
      this.posts.forEach((post) => {
        this.numLikes = this.numLikes + post.num_likes;
        this.numDislikes = this.numDislikes + post.num_dislikes;
      });
      this.updateChartData();
    });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  public loadPosts(): void {
    this.store.dispatch(PostsAction.getPosts());
  }

  private updateChartData(): void {
    this.barChartData = {
      ...this.barChartData,
      datasets: [
        { data: [this.numLikes], label: 'Likes' },
        { data: [this.numDislikes], label: 'Dislikes' },
      ],
    };
    const maxValue = Math.max(this.numLikes, this.numDislikes) + 1;

    this.barChartOptions = {
      ...this.barChartOptions,
      scales: {
        x: {
          ...this.barChartOptions?.scales?.x,
          max: maxValue,
        },
      },
    };
  }
}
