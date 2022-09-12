const { Router } = require('express');
const router = Router();

const authRouter = require('./authRouter');
const postRouter = require('./postRouter');
const userRouter = require('./userRouter');
const commentsRouter = require('./commentsRouter');
const categoriesRouter = require('./categoriesRouter');

const {join} = require('path');

// router.get('/', (_, resp) => {
//     // resp.send("<h1>Client placeholder</h1>")
//     resp.sendFile(join(__dirname, '..', 'index.html'));
// })

router.use('/auth', authRouter);

router.use('/posts', postRouter);

router.use('/users', userRouter);

router.use('/comments', commentsRouter);

router.use('/categories', categoriesRouter);

//test shit
router.get('/images/avatar/:image_name', (req, resp) => {
    const { image_name } = req.params;

    resp.sendFile(join(__dirname, '..', 'user_data', 'avatars', image_name));
})

module.exports = router;