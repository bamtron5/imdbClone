import express = require('express');
let router = express.Router();
import Movie from '../models/Movie';
import * as passport from 'passport';
import methods from './methods';
import * as acl from 'acl';
import * as mongoose from 'mongoose';

let movies = [
  { director: 'John Carpenter', title: 'The Thing' },
  { director: 'Adam Sandler', title: 'Happy Gilmore' },
  { director: 'Adam Sandler', title: 'Waterboy' },
  { director: 'Eli Roth', title: 'Hostel' }
];
Movie.find({}).remove(() => {
  movies.map((movie, key) => {
      Movie.create(movie);
  });
});

/* GET movies  with changes*/
router.get('/movies', methods.isAuthenticated, function(req, res, next) {
    console.log('== GET MOVIES ==');
    Movie.find().then((movies) => {
      res.json(movies);
    }).catch((err) => {
      res.status(500).send({err: err});
    })
});

/* GET movie by id */
router.get('/movies/:id', function(req, res, next) {
    console.log(req.params)
    Movie.findOne({ _id: req.params.id }).then((movies) => {
        console.log(movies)
        res.json(movies);
    }).catch((err) => {
        console.log('NOOOOO', err);
    })
});

//using upsert
router.post('/movies', (req, res, next) => {
    let movie = req.body;
    Movie.update({ _id: movie._id }, movie, { upsert: true })
        .then((results) => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log('meh', err);
        });
});

router.delete('/movies/:_id', methods.checkAcl, (req, res, next) => {
    console.log('deletingMovie');
    let movieId = req.params._id;
    Movie.remove({ _id: movieId }).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log(err);
    });
});

// /* delete movie by id */
// router.delete('/movies/:id', function(req, res, next) {
//   let id = parseInt(req.params['id']);
//   if (!findMovie(id)) {
//     res.sendStatus(404);
//   } else {
//     movies = movies.filter((movie)=> {
//       return movie.id != id;
//     });
//     res.sendStatus(200);
//   }
// });

/* find matching movies */
// router.get('/movies/search/:search', function(req, res, next) {
//     let search = req.params['search'];
//     let matches = movies.filter((movie)=>{
//       return movie.title.indexOf(search) == 0;
//     });
//     res.json(matches);
// });

export = router;
