const express = require('express');
const router = express.Router();

// Database
const db = require('../models');

// Admin Index
router.get('/', (req, res) => {
    db.Game.find({}, (err, allGames) => {
        if(err) return console.log(err);
        console.log(allGames);
        res.render('admin/index'), {
            admin: allGames,
        };
    });
});

// New Game
router.post('/', (req, res) => {
    db.Game.find({}, (err, games) => {
        if(err) return console.log(err);
        res.render('admin/new', {games}); //{games/admins}
    })
});

// Create Game
router.post('/', (req, res) => {
    console.log(req.body);
    db.Game.create(req.body, (err, newGame) => {
        if(err) return console.log(err);
        console.log(newGame);

    db.Console.findById(req.body.consoleId, (err, foundConsole) => {
        foundConsole.games.push(newGame);
        foundConsole.save(err, savedConsole) => {
            console.log('savedConsole: ', savedConsole);
            res.redirect('/libray');
            })
        })
    });
});
// Admin Show