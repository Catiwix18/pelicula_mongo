const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

async function startServer() {
  try {
    await mongoose.connect('mongodb://localhost:27017/moviedatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const app = express();
    const port = 3000;

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    const movieSchema = new mongoose.Schema({
      title: String,
      director: String,
      year: Number
    });

    const Movie = mongoose.model('Movie', movieSchema);

    app.post('/saveMovie', (req, res) => {
      const { title, director, year } = req.body;
      const newMovie = new Movie({
        title: title,
        director: director,
        year: year
      });

      newMovie.save().then(() => {
        console.log('New movie created!');
        res.status(200).send('Movie created successfully');
      }).catch((error) => {
        console.error('Error creating movie:', error);
        res.status(500).send('Error creating movie');
      });
    });

    app.get('/getMovies', (req, res) => {
      Movie.find().then((movies) => {
        console.log('All movies:', movies);
        res.status(200).json(movies);
      }).catch((error) => {
        console.error('Error retrieving movies:', error);
        res.status(500).send('Error retrieving movies');
      });
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

startServer();
