const Post = require("../models/post.models.js");

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      status: "success",
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (e) {
    console.log(e);
    next(e);
    // res.status(400).json({
    //   status: "fail",
    // });
  }
};

exports.getOnePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (e) {
    next(e);
    // res.status(400).json({
    //   status: "fail",
    // });
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const post = await Post.create(req.body);
    await post.save();

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (e) {
    console.log(e);
    next(e);
    // res.status(400).json({
    //   status: "fail",
    // });
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (e) {
    // res.status(400).json({
    //   status: "fail",
    // });
    next(e);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    post
      ? res.status(200).json({
          status: "success",
        })
      : res.status(200).json({
          status: "Post doesn't exist",
        });
  } catch (e) {
    // res.status(400).json({
    //   status: "fail",
    // });
    next(e);
  }
};
