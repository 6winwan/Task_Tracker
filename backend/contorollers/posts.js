const Post = require('../models/post')

// Get all posts
exports.getPosts = (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents
    });
  });
}

// Get a post
exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found'})
    }
  })
}

// Create a post
exports.createPost = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    createdAt: req.body.createdAt,
    status: req.body.status
  });
  post.save().then(CreatedPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: CreatedPost._id
    })
  });
}

// Update a post with 'req.parmas.id'
exports.updatePost = (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    status: req.body.status
  })
  Post.updateOne({_id: req.params.id}, post)
    .then(result=> {
      console.log(result);
      res.status(200).json({ message: "Updated Successful"})
    })
}

// delete a post with 'req.param.id'
exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result => {
      console.log(result);
      res.status(200).json({message: 'Post deleted!'});
    })
}

