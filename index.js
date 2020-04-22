/** @format */
const movies = require("./movies.json");
const express = require("express");
const app = express();
const fs = require("fs");

// Used as middleware to parse json
app.use(express.json());

// Getting the data
app.get("/movies/genres", (req, res) => {
  res.send(movies);
});

app.get("/movies/genres/:genre", (req, res) => {
  const genreMovies = movies.filter((movie) => {
    if (movie.genre === req.params.genre) return movie;
  });

  if (genreMovies.length !== 0) res.send(genreMovies);
  else res.status(404).send("Given genre is not available bujji..!!");
});

// Posting the data ..!!!
app.post("/movies/genres", (req, res) => {
  const movieUpload = req.body;
  movieUpload.id = Math.ceil(Math.random() * 1000000);

  const findMovie = movies.filter((m) => {
    return m.movie === movieUpload.movie;
  });
  
  movies.push(movieUpload);

  if (findMovie.length === 0) {
    fs.writeFile("./movies.json", JSON.stringify(movies), (err) => {
      if (err) throw err;
      res.send("The database has been updated successfully")
    });
  } else {
      res.status(400).send("Movie is already available in the system ..!!")
  }
});

// Putting the data
app.put("/movies/genres/:movie", (req, res) => {
    const movieIndex = movies.findIndex(m => {
        return m.movie === req.params.movie;
    })
    if(movieIndex === -1) res.send("Movie not available in the data base ..!!")
    else {
        movies[movieIndex].genre = req.body.genre
        fs.writeFile('./movies.json', JSON.stringify(movies), (err) => {
            if(err) res.send("Having error in updating");
            res.send("Updated successfully in database ..!!");
        })
    }
})

// Deleting the data
app.delete('/movies/genres/:movie', (req, res) => {
    const movieIndex = movies.findIndex(m => {
        return m.movie === req.params.movie
    });

    if(movieIndex === -1) res.send("Unable to locate the movie you are trying to delete")
    else {
        movies.splice(movieIndex, 1);
        fs.writeFile('./movies.json', JSON.stringify(movies), (err) => {
            if(err) res.send("Unexpected error occured ..!!")
        })
        res.send("The movie has been deleted successfully ...!!!");
    }
    console.log(movies);
})


app.listen(process.env.PORT || 3000);
