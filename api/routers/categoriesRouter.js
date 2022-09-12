const { Router } = require('express');

const categoriesRouter = Router();

const CategoryController = require('../controllers/CategoriesController');
const AuthController = require('../controllers/AuthController');

categoriesRouter.route('/')
    .all(AuthController.CheckAuth)
    .post(CategoryController.CreateCategory)
    .get(CategoryController.GetCategoriesList)

categoriesRouter.route('/:category_id')
    .all(AuthController.CheckAuth)
    .get(CategoryController.GetCategory)
    .delete(CategoryController.DeleteCategory)
    .patch(CategoryController.UpdateCategory)

categoriesRouter.get('/:category_id/posts', AuthController.CheckAuth, CategoryController.GetPostsList);

module.exports = categoriesRouter;