const { Router } = require('express');

const postRouter = Router();

const AuthController = require('../controllers/AuthController');
const PostController = require('../controllers/PostController');

const { downloadMultiple } = require('../helpers/fileDownloader');


postRouter.route('/:post_id')
    .all(AuthController.CheckAuth)
    .patch(PostController.UpdatePost)
    .get(PostController.GetPost)
    .delete(PostController.DeletePost)

postRouter.route('/:post_id/comments')
    .all(AuthController.CheckAuth)
    .post(PostController.CreateComment)
    .get(PostController.GetCommentsList)

postRouter.route('/:post_id/like')
    .all(AuthController.CheckAuth)
    .get(PostController.GetLikesList)
    .post(PostController.CreateLike)
    .delete(PostController.DeleteLike)

postRouter.get('/:post_id/categories', AuthController.CheckAuth, PostController.GetCategories);
postRouter.post('/:post_id/media', AuthController.CheckAuth, downloadMultiple, PostController.UploadPostMedia)

postRouter.route('/')
    .all(AuthController.CheckAuth)
    .post(PostController.CreatePost)
    .get(PostController.GetPostsList)

module.exports = postRouter;