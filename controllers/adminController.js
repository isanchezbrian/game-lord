const express = require('express');
const router = express.Router();
const db = require('../models');


// Admin Index
router.get('/', (req, res) => {
  // Query For all Games
  db.Game.find({}, (err, allGames) => {
    if (err) return console.log(err);
    // Log all games
    console.log('All Games = ', allGames);
    // Render the index template with all games
    res.render('admin/index', {
      games: allGames,
    });
  });
});

// New Game
router.get('/new', (req, res) => {
    res.render('admin/new');
})

// Admin Show
router.get('/:id', (req, res) => {
  // Query the database for the games by ID
  db.Game.findById(req.params.id)
    .populate({path: 'library'})
    .exec((err, foundGame) => {
      if(err) return console.log(err);
      res.render('admin/show', {
        game: foundGame,
      });
  })
});

// Create Game
router.post('/', (req, res) => {
    console.log('Request body = ', req.body);
    db.Game.create(req.body, (err, newGame) => {
        if(err) return console.log(err);
        console.log('New Game = ', newGame);
        res.redirect('/admin');
    })
})

// Game Edit
router.get('/:id/edit', (req, res) => {
  db.Game.findById(req.params.id, (err, foundGame) => {
    if(err) return console.log(err);

    res.render('admin/edit', {
      game: foundGame,
    });
  });
});


// Game Update
router.put('/:id', (req, res) => {
  // Log data from client
  console.log('Updated Game = ', req.body);

  db.Author.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true},
    (err, updatedGame) => {
      if(err) return console.log(err);

      res.redirect('/admin');
    }
  );
});


// Game Destroy/Delete
router.delete('/:id', (req, res) => {
  console.log('Deleting Game ID = ', req.params.id);

  db.Game.findByIdAndDelete(req.params.id, (err, deletedGame) => {
    if(err) return console.log(err);
    // Log the deleted game
    console.log('The deleted game = ', deletedGame);
    db.Game.deleteMany({
      _id: {
        $in: deletedGames.admin
      }
    }, (err, data) => {
      res.redirect('/admin');
    })
  });
});

module.exports = router;
