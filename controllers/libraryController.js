const express = require('express');
const router = express.Router();
const db = require('../models');

// Console Index
router.get('/', (req,res) => {
    db.Console.find({}, (err, allConsoles) => {
      if (err) return console.log(err);
      console.log('All Consoles = ', allConsoles);
      res.render('admin/index', {
        consoles: allConsoles,
      });
    });
  });

// New Game/Console
router.get('/new', (req, res) => {
    db.Console.find({}, (err, games) => {
        if(err) return console.log(err);
        res.render('/admin/new', {consoles});
    })
});

// Create Console
router.post('/', (req, res) => {
    console.log('Request body = ', req.body);
    db.Console.create(req.body, (err, newConsole) => {
      if(err) return console.log(err);
      console.log('New Console = ', newConsole);
    //   db.Game.findById(req.body.gameId, (err, foundGame) => {
    //     foundGame.push(newGame);
    //     foundGame.save((err, savedGame) => {
    //       console.log('savedGame: ', savedGame);
    //       res.render('/admin');
    //     })
    //   })
    });
  });


// Show Game
router.get('/:id', (req, res) => {
    db.Game.findOne({'consoles': req.params.id})
    .populate({
        path: 'consoles',
        match: {_id: req.params.id}
    })
    .exec((err, foundGame) => {
        console.log('games: ', foundGame);
        res.render('admin/show', {
            game: foundGame.consoles[0],
            game: foundGame,
        });
    })
});

// Show Console Main
router.get('/:id', (req, res) => {
    db.Console.findOne({'games': req.params.id})
    .populate({
        path: 'games',
        match: {_id: req.params.id}
    })
    .exec((err, foundConsole) => {
        console.log('consoles: ', foundConsole);
        res.render('admin/show', {
            console: foundConsole.games[0],
            console: foundConsole,
        });
    })
});


// Show Console
router.get('/:id', (req, res) => {
    db.Console.findById(req.params.id)
    .populate({path: 'games'})
    .exec((err, foundConsole) => {
      if(err) return console.log(err);
      res.render('admin/show', {
        console: foundConsole,
      })
    })
  })

// Edit Game 
router.get('/:id/edit', (req, res) => {
    db.Game.find({}, (err, allGames) => {
        db.Game.findOne({'consoles': req.params.id})
        .populate({
            path: 'consoles',
            match: {_id: req.params.id}
        })
        .exec((err, foundConsoleGame) => {
            res.render('./admin/edit', {
                console: foundConsoleGame.library[0],
                games: allGames,
                consoleGame: foundConsoleGame
            })
        })
    });
});
// Edit Console Main
router.get('/:id/edit', (req, res) => {
    db.Console.find({}, (err, allConsoles) => {
        db.Console.findOne({'games': req.params.id})
        .populate({
            path: 'games',
            match: {_id: req.params.id}
        })
        .exec((err, foundConsoleGame) => {
            res.render('./admin/edit', {
                game: foundConsoleGame.library[0],
                consoles: allConsoles,
                consoleGame: foundConsoleGame
            })
        })
    });
});

// Edit Console
router.get('/:id/edit', (req, res) => {
    db.Console.findById(req.params.id, (err, foundConsole) => {
      if(err) return console.log(err);
  
      res.render('admin/edit', {
        console: foundConsole,
      });
    });
  });

// Game Update
router.put('/:id/', (req, res) => {
    db.Game.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true},
        (err, updatedGame) => {
            if(err) return console.log(err);
            db.Game.findOne({'games': req.params.id}, (err, foundGame) => {
                if(foundGame._id.toString() !== req.body.gameId){
                    foundGame.library.remove(req.params.id);
                    foundGame.save((err, savedGame) => {
                        db.Game.findById(req.body.gameId, (err, newGame) => {
                            newGame.library.push(updatedGame);
                            newGame.save((err, savedGame) => {
                            res.redirect(`/admin/${req.params.id}`);
                        })
                    })
                })
            } else {
                res.redirect(`/admin/${req.params.id}`);
            }
        })
    });
});

// Console Update Main
router.put('/:id/', (req, res) => {
    db.Game.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true},
        (err, updatedGame) => {
            if(err) return console.log(err);
            db.Console.findOne({'games': req.params.id}, (err, foundConsole) => {
                if(foundConsole._id.toString() !== req.body.gameId){
                    foundConsole.remove(req.params.id);
                    foundConsole.save((err, savedConsole) => {
                        db.Console.findById(req.body.ConsoleId, (err, newConsole) => {
                            newConsole.push(updatedGame);
                            newConsole.save((err, savedNewGame) => {
                            res.redirect(`/admin/${req.params.id}`);
                        })
                    })
                })
            } else {
                res.redirect(`/admin/${req.params.id}`);
            }
        })
    });
});

// Console Update
router.put('/:id', (req, res) => {
    // Log data from client
    console.log('Updated Console = ', req.body);
  
    db.Console.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true},
      (err, updatedConsole) => {
        if(err) return console.log(err);
  
        res.redirect('/admin');
      }
    );
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

// Delete Console Main
router.delete('/:id', (req, res) => {
    db.Game.findByIdAndDelete(req.params.id, (err, deletedGame) => {
        if(err) return console.log(err);
        console.log(deletedGame);
        db.Console.findOne({'games': req.params.id}, (err, foundConsole) => {
            foundConsole.remove(req.params.id);
            foundConsole.save((err, updatedConsole) => {
                console.log(updatedConsole);
                res.redirect('/admin');
            })
        })
    });
});

// Delete Console
router.delete('/:id', (req, res) => {
    console.log('Deleting Console ID = ', req.params.id);
  
    db.Console.findByIdAndDelete(req.params.id, (err, deletedConsole) => {
      if(err) return console.log(err);
      // Log the deleted console
      console.log('The deleted console = ', deletedConsole);
      db.Console.deleteMany({
        _id: {
          $in: deletedConsole.admin
        }
      }, (err, data) => {
        res.redirect('/admin');
      })
    });
  });

module.exports = router;