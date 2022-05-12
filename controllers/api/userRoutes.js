const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll({ 
            attribute: { exclude: ['password'] },
        });
        res.status(200).json(userData);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findOne({ 
            attributes: { exclude: ['password'] },
            where: { id: req.params.id },
            include: [
                { 
                    model: Post,
                    attributes: ['id', 'name', 'description', 'data_created'],
                },
                {
                    model: Comment, 
                    attributes: ['id', 'comment', 'data_created'],
                    include: { 
                        model: Post,
                        attributes: ['name'],
                    },
                },

                { model: Post, attributes: ['name'],
            },

            ],
        });
        if (!userData) {
            res.status(404).json({ message: `No users found with this ID: ${req.params.id}`});
            return;
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/signup', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where:
            { username: req.body.username }
        });

        if (!userData) {
            res.status(400).json({ message: 'Incorrect username and/or password' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect username and/or password' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'Logged in'});
        });
    } catch (err) {
        res.status(400).json(err);
    }

});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;