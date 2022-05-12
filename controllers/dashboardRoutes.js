const router = require('express').Router();
const {User, Post, Comment} = require('../models')
const withAuth = require('../utils/auth')

router.get('/', withAuth, async (req, res) => {
    try {
        const postData = await Post.findAll({ 
            where: { user_id: req.session.user_id,
            },
            attributes: ['id', 'name', 'description', 'date_created'],
            include: [
                { 
                    model: Comment,
                    attributes: ['id', 'comment', 'post_id', 'user_id', 'date_created'],
                    include: {
                        model: User, attributes: ['name'],
                    },
                },
                {
                    model: User, attributes: ['name'],
                },
            ],
        })
        const posts = postData.map((allPosts) => allPosts.get({ plain: true }));
        res.render('dashboard', {posts, logged_in: true, username: req.session.username});

    } catch (err) {
        res.status(500).json(err);
    }

});

router.get('/new', async (req, res) => {
    res.render('addPost', {
        logged_in: req.session.logged_in,
        username: req.session.name,
    })
});

router.post('/new', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create(...req.body);
        req.session.save(() => {
            req.session.user_id = newPost.id;
            req.session.logged_in = true;
            res.render('addPost', { newPost, logged_in: true, username: req.session.username });

        });
        const post = newPost.get({ plain: true });
        res.render('dashboard', { 
            ...withAuthpost,
            logged_in: req.session.logged_in
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;