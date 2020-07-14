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

// New Game
router.get('/new', (req, res) => {
    db.Game.find({}, (err, games) => {
        if(err) return console.log(err);
        res.render('/library/new', {games});
    })
});

// Create Game
router.post('/', (req, res) => {
    console.log(req.body);
    db,Game.create(req.body, (err, newGame) => {
        if(err) return console.log(err);
        console.log(newGame);
    db.Game.findById(req.body.gameId, (err, foundGame) => {
        foundGame.library.push(newGame);
        foundGame.save((err, savedGame) => {
            console.log('savedGame: ', savedGame);
            res.redirect('/library');
            })
        })
    });
});

// Library Show
router.get('/:id', (req, res) => {
    db.Game.findOne({'games': req.params.id})
    .populate({
        path: 'library',
        match: {_id: req.params.id}
    })
    .exec((err, foundGame) => {
        console.log('games: ', foundGame);
        res.render('library/show', {
            game: foundGame.library[0],
            game: foundGame,
        });
    })
});

// Edit Game 
router.get('/:id/edit', (req, res) => {
    db.Game.find({}, (err, allGames) => {
        db.Game.findOne({'games': req.params.id})
        .populate({
            path: 'library',
            match: {_id: req.params.id}
        })
        .exec((err, foundExistingGame) => {
            res.render('./library/edit', {
                game: foundExistingGame.library[0],
                games: allGames,
                games: foundExistingGame
            })
        })
    });
});

// Game Update
router.put('/:id/', (req, res) => {
    db.Game.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true},
        (err, UpdatedGame) => {
            if(err) return console.log(err);
            db.Game.findOne({'games': req.params.id}, (err, foundGame) => {
                if(foundGame._id.toString() !== req.body.gameId){
                    foundGame.library.remove(req.params.id);
                    foundGame.save((err, savedGame) => {
                        db.Game.findById(req.body.gameId, (err, newGame) => {
                            newGame.library.push(UpdatedGame);
                            newGame.save((err, savedGame) => {
                            res.redirect(`/library/${req.params.id}`);
                        })
                    })
                })
            } else {
                res.redirect(`/library/${req.params.id}`);
            }
        })
    });
});

// Delete Game
router.delete('/:id', (req, res) => {
    db.Game.findByIdAndDelete(req.params.id, (err, deletedGame) => {
        if(err) return console.log(err);
        console.log(deletedGame);
        db.Game.findOne({'games': req.params.id}, (err, foundGame) => {
            foundGame.library.remove(req.params.id);
            foundGame.save((err, updatedGame) => {
                console.log(updatedGame);
                res.redirect('/library');
            })
        })
    });
});

module.exports = router;