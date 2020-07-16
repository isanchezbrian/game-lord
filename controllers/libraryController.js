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

// router.get('/', (req,res) => {
//     db.Console.find({}, (err, allConsoles) => {
//       if (err) return console.log(err);
//       console.log('All Consoles = ', allConsoles);
//       res.render('admin/index', {
//         consoles: allConsoles,
//       });
//     });
//   });

// New Game/Console
router.get('/new', (req, res) => {
    db.Game.find({}, (err, games) => {
        if(err) return console.log(err);
        res.render('/admin/new', {games});
    })
});

// Create Game
router.post('/', (req, res) => {
    console.log(req.body);
    db.Console.create(req.body, (err, newConsole) => {
        if(err) return console.log(err);
        console.log(newConsole);
    db.Game.findById(req.body.gameId, (err, foundGame) => {
        foundGame.admin.push(newGame);
        foundGame.save((err, savedGame) => {
            console.log('savedGame: ', savedGame);
            res.redirect('/admin');
            })
        })
    });
});

// router.post('/', (req, res) => {
//     console.log('Request body = ', req.body);
//     db.Console.create(req.body, (err, newConsole) => {
//       if(err) return console.log(err);
//       console.log('New Console = ', newConsole);
//       db.Game.findById(req.body.gameId, (err, foundGame) => {
//         foundGame.console.push(newGame);
//         foundGame.save((err, savedGame) => {
//           console.log('savedGame: ', savedGame);
//           res.render('/admin');
//         })
//       })
//     });
//   });

// Library Show
router.get('/:id', (req, res) => {
    db.Game.findOne({'consoles': req.params.id})
    .populate({
        path: 'admin',
        match: {_id: req.params.id}
    })
    .exec((err, foundGame) => {
        console.log('games: ', foundGame);
        res.render('admin/show', {
            console: foundGame.admin[0],
            game: foundGame,
        });
    })
});

// router.get('/:id', (req, res) => {
//     db.Console.findById(req.params.id)
//     .populate({path: 'library'})
//     .exec((err, foundConsole) => {
//       if(err) return console.log(err);
//       res.render('admin/show', {
//         console: foundConsole,
//       })
//     })
//   })

// Edit Game/Console 
router.get('/:id/edit', (req, res) => {
    db.Game.find({}, (err, allGames) => {
        db.Game.findOne({'consoles': req.params.id})
        .populate({
            path: 'admin',
            match: {_id: req.params.id}
        })
        .exec((err, foundConsoleGame) => {
            res.render('./admin/edit', {
                console: foundConsoleGame.admin[0],
                games: allGames,
                consoleGame: foundConsoleGame
            })
        })
    });
});

// router.get('/:id/edit', (req, res) => {
//     db.Console.findById(req.params.id, (err, foundConsole) => {
//       if(err) return console.log(err);
  
//       res.render('admin/edit', {
//         console: foundConsole,
//       });
//     });
//   });

// Game Update
router.put('/:id/', (req, res) => {
    db.Console.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true},
        (err, updatedConsole) => {
            if(err) return console.log(err);
            db.Game.findOne({'consoles': req.params.id}, (err, foundGame) => {
                if(foundGame._id.toString() !== req.body.gameId){
                    foundGame.admin.remove(req.params.id);
                    foundGame.save((err, savedGame) => {
                        db.Game.findById(req.body.gameId, (err, newGame) => {
                            newGame.admin.push(UpdatedConsole);
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

// router.put('/:id', (req, res) => {
//     // Log data from client
//     console.log('Updated Console = ', req.body);
  
//     db.Console.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {new: true},
//       (err, updatedConsole) => {
//         if(err) return console.log(err);
  
//         res.redirect('/admin');
//       }
//     );
//   });

// Delete Game
router.delete('/:id', (req, res) => {
    db.Console.findByIdAndDelete(req.params.id, (err, deletedConsole) => {
        if(err) return console.log(err);
        console.log(deletedConsole);
        db.Game.findOne({'consoles': req.params.id}, (err, foundGame) => {
            foundGame.admin.remove(req.params.id);
            foundGame.save((err, updatedGame) => {
                console.log(updatedGame);
                res.redirect('/admin');
            })
        })
    });
});

// router.delete('/:id', (req, res) => {
//     console.log('Deleting Console ID = ', req.params.id);
  
//     db.Console.findByIdAndDelete(req.params.id, (err, deletedConsole) => {
//       if(err) return console.log(err);
//       // Log the deleted console
//       console.log('The deleted console = ', deletedConsole);
//       db.Console.deleteMany({
//         _id: {
//           $in: deletedConsole.admin
//         }
//       }, (err, data) => {
//         res.redirect('/admin');
//       })
//     });
//   });

module.exports = router;