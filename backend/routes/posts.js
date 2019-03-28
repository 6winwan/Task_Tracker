const express = require('express');
const PostContoller = require('../contorollers/posts');

const router = express.Router();


router.get("", PostContoller.getPosts);

router.get("/:id", PostContoller.getPost);

router.post("", PostContoller.createPost);

router.put("/:id", PostContoller.updatePost);

router.delete("/:id", PostContoller.deletePost);


module.exports = router;

