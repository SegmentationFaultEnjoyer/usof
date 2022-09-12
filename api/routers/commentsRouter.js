const { Router } = require('express');

const commentsRouter = Router();

const AuthController = require('../controllers/AuthController');
const CommentsController = require('../controllers/CommentsController');

commentsRouter.route('/:comment_id')
    .all(AuthController.CheckAuth)
    .get(CommentsController.GetComment)
    .delete(CommentsController.DeleteComment)
    .patch(CommentsController.UpdateComment)

commentsRouter.route('/:comment_id/like')
    .all(AuthController.CheckAuth)
    .post(CommentsController.CreateLike)
    .delete(CommentsController.DeleteLike)
    .get(CommentsController.GetLikesList)

module.exports = commentsRouter;