import { Component, OnInit} from '@angular/core';

import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute} from '@angular/router';
import { ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  post: Post;
  loading = false;
  form: FormGroup;
  private mode = 'create';
  private postId: string;

  // Setup Dependency Injection 'PostService' and 'route'
  constructor(public postService: PostsService, public route: ActivatedRoute) {}

  // Initialize all data boundary properties
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      status: new FormControl(null, {validators: [Validators.required]}),
      createdAt: new FormControl(null)
    });
    /* If postId is found in the paraMap,
       it will be edit mode and fetch the values of postId
       If not, it will be create mode and does not pass any values  */
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.loading = true;
        this.postService
          .getPost(this.postId)
          .subscribe(postData => {
            this.loading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              createdAt: postData.createdAt,
              status: postData.status,
            };
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              status: this.post.status,
              createdAt: this.post.createdAt
            });
      });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  // Save or update post
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    /* If it is create mode, it calls addPost()
       else it calls updatedPost  */
    if (this.mode === 'create') {
      this.postService
        .addPost(
          this.form.value.title,
          this.form.value.content,
          this.form.value.status
        );
    } else {
      this.postService
        .updatedPost(
          this.postId,
          this.form.value.title,
          this.form.value.content,
          this.form.value.createdAt,
          this.form.value.status
        );
    }
    this.form.reset();
  }
}
