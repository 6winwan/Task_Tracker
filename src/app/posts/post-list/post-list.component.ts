import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})

export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  els = new Date().getTime();
  private postsSub: Subscription;
  loading = false;

  // Setup Dependency Injection 'PostService'
  constructor( public postsService: PostsService ) {}

  // Initialize all data boundary properties
  ngOnInit() {
    this.loading = true;
    this.postsService.getPosts();

    // Make them observable then subscribe
    this.postsSub = this.postsService.getPostUpdateListner()
      .subscribe((posts: Post[]) => {
        this.loading = false;
        this.posts = posts;
        this.els = this.els;
      });
  }

  // Delete post method
  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  // Cleanup just before angular destroys the copoenent prevent memory leak
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
