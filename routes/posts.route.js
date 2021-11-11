const express = require("express");

const postController = require("../controllers/posts.controller.js");
const protect = require("../middleware/auth.middleware.js");

const router = express.Router();

//localhost:3000/:id
router
  .route("/")
  .get(protect, postController.getAllPosts)
  .post(protect, postController.createPost);

router
  .route("/:id")
  .get(protect, postController.getOnePost)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
