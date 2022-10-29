const { Router } = require('express');
const router = Router();

const authRouter = require('./authRouter');
const postRouter = require('./postRouter');
const userRouter = require('./userRouter');
const commentsRouter = require('./commentsRouter');
const categoriesRouter = require('./categoriesRouter');

const {join} = require('path');

router.use('/auth', authRouter);

router.use('/posts', postRouter);

router.use('/users', userRouter);

router.use('/comments', commentsRouter);

router.use('/categories', categoriesRouter);

router.get('/images/:type/:image_name', (req, resp) => {
    const { image_name, type } = req.params;

    resp.sendFile(join(__dirname, '..', 'user_data', type, image_name));
})

module.exports = router;