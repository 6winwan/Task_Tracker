import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BackEnd = environment.apiUrl + '/posts/';

// PostService is created by the root application injector
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  // Making basic GET, POST, PUT, DELETE requests by HTTPClient libarary
  constructor(private http: HttpClient, private router: Router) {}

  // Get all posts
  getPosts() {
    this.http.get<{ message: string, posts: any }>(BackEnd)
      .pipe( map((postData) => {
        return postData.posts.map( post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            createdAt: post.createdAt,
            status: post.status,
          };
        });
      }))
      .subscribe((transformedData) => {
        this.posts = transformedData;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // Make them subscribable
  getPostUpdateListner() {
    return this.postsUpdated.asObservable();
  }

  // Get a single post by postId
  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      createdAt: number,
      status: string}
      >(BackEnd + id);
  }

  // Add a post
  addPost(title: string, content: string, status: string) {
    const post: Post = {
      id: null,
      title: title,
      content: content,
      createdAt: new Date().getTime(),
      status: status
    };
    // Sending an post request to backend and updates posts
    this.http.post<{ message: string, postId: string }>(BackEnd, post)
      .subscribe((res) => {
        const id = res.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
    });
  }

  // Update a post
  updatedPost(id: string, title: string, content: string, createdAt: number, status: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content,
      createdAt: createdAt,
      status: status
    };
    //  Sending a put requrest to backend and updates posts
    this.http.put(BackEnd + id, post)
      .subscribe(res => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  // delete a post with postId and filter a deleted post from posts
  deletePost(postId: string) {
    if (window.confirm('Are sure you want to delete this Task?')){
    this.http.delete(BackEnd + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
    }
  }
}
