const router = require('express').Router();
const { Comment } = require('../../models');

const withAuth = require('../../utils/auth');


router.put('/:id', withAuth, async (req, res) => {
    try {
        const updatedComment = await Comment.update(
            {
                title: req.body.name,
                content: req.body.description,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        if (!updatedComment) {
            res.status(404).json( { message: 'No comment found with this ID'});
            return;
        }

        res.render('post', updatedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.render('post', newComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('delete/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            }
        });

        if (!commentData) {
            res.status(404).json({ message: 'No Comment found with this ID'});
            return;
        }

        res.render('post', commentData);
    } catch (err) {
        res.status(500).json(err);
    
    }
});

module.exports = router;