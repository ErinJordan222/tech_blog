const router = require('express').Router();
const { User, Post, Comment} = require('../models');

router.get('/', async (req, res) => {
    try {
    const postData = await Post.findAll({ 
        attributes: ['id', 'name', 'description', 'date_created'],
        include: [{ 
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
    res.render('homepage', {
        posts,
        logged_in: req.session.logged_in,
        username: req.session.username,
    });
  
  } catch (err) {
      res.status(500).json(err);
  }
  });
  
  router.get('/login', async (req, res) => {
      if (req.session.loggedIn) {
          res.redirect('/');
          return;
      }
      res.render('login');
  });
  
  router.get('/signup', async (req, res) => {
      res.render('signup');
  });
  
  module.exports = router;