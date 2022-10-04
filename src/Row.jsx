import React, { useState, useEffect } from "react";
import axios from "./axios.js";
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";
function Row(props) {
  //for showing the images
  const baseURL = `https://image.tmdb.org/t/p/original`;
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  //A snippet of code which run based on a specific condition/varraible

  useEffect(() => {
    //if useeffect second argument is a [], it means that we want to run the use effect just once(when page load)

    //getting the data from tmdb website
    async function fetchDate() {
      const request = await axios.get(props.fetchUrl);
      /*axios.get is equale to "https://api.themoviedb.org/3" and with props.fetchUrl we are appending 
      the rest of url from request.js
      */
      setMovies(request.data.results);
      return request;
    }
    fetchDate();
  }, [props.fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVar: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    // if video is already open then it will close
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
        .then((url) => {
          //here it is gonna return the full url to movie trailer in youtube
          //ex: https://www.youtube.com/watch?v=xdeQ42DsFS
          //now we should pull out the (id or "v") from url
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
          console.log(url);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="row">
      <h2>{props.title}</h2>

      <div className="row__posters">
        {movies.map((movie, index) => (
          <img
            onClick={() => handleClick(movie)}
            className={`row__poster ${props.isLargeRow && "row__posterLarge"}`}
            key={index}
            src={`${baseURL}${props.isLargeRow ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
