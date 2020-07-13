const express = require('express');
const router = express.Router();
const db = require('../models');

// Library Index
router.get('/', (req, res) => {
    db.Game.find({}, (err, allGames) => {
        if(err) return console.log(err);
        console.log(allGames);
        res.render('library/index', {
        games: allGames,
        });
    });
});

// Library Show
router.get('/:id', (req, res) => {
    db.Game.findOne({'library': req.params.id})
    .populate({
        path: 'library',
        match: {_id: req.params.id}
    })
    .exec((err, foundGame) => {
        console.log('admin: ', foundGame);
        res.render('library/show', {
            game: foundGame.admin[0],
        });
    });
});

module.exports = router;