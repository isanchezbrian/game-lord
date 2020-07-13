const express = require('express');
const router = express.Router();
const db = require('../models');


// Library Index
router.get('/', (req, res) => {
  // Query For all Games
  db.Author.find({}, (err, allGames) => {
    if (err) return console.log(err);
    // Log all games
    console.log('All Games = ', allGames);
    // Render the index template with all games
    res.render('library/index', {
      games: allGames,
    });
  });
});


// Library Show
router.get('/:id', (req, res) => {
  // Query the database for the games by ID
  db.Game.findById(req.params.id)
    .populate({path: 'admin'})
    .exec((err, foundGame) => {
      if(err) return console.log(err);
      res.render('library/show', {
        game: foundGame,
      });
  })
});


// Library Edit
router.get('/:id/edit', (req, res) => {
  db.Game.findById(req.params.id, (err, foundGame) => {
    if(err) return console.log(err);

    res.render('library/edit', {
      game: foundGame,
    });
  });
});


// Game Update
router.put('/:id', (req, res) => {
  // Log the data from client
  console.log('Updated Game = ', req.body);

  db.Author.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true},
    (err, updatedGame) => {
      if(err) return console.log(err);

      res.redirect('/library');
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
        $in: deletedGames.games
      }
    }, (err, data) => {
      res.redirect('/library');
    })
  });
});

module.exports = router;
