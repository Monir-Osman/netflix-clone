import React, { useState, useEffect } from "react";
import axios from "./axios.js";
import requests from "./request.js";
import "./Banner.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

function Banner(props) {
  const [movie, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);

      //get random movie from the array af movies
      const randomMovie =
        request.data.results[Math.floor(Math.random() * request.data.results.length)];
      setMovies(randomMovie);

      return request;
    }
    fetchData();
  }, []);

  const opts = {
    height: "450",
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
      movieTrailer(movie?.name || movie?.original_name || movie?.title || "")
        .then((url) => {
          console.log(url);

          //here it is gonna return the full url to movie trailer in youtube
          //ex: https://www.youtube.com/watch?v=xdeQ42DsFS
          //now we should pull out the (id or "v") from url
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((err) => console.log(err));
    }
  };

  //if text length is more than specific amount it will cut and ... will append
  const truncateString = (string = "", maxLength = 50) =>
    string.length > maxLength ? `${string.substring(0, maxLength)}…` : string;

  return (
    <header
      className="banner"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie?.backdrop_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">{movie?.title || movie?.name || movie?.original_name}</h1>
        <div className="banner__buttons">
          <button onClick={() => handleClick(movie)} className="banner__button">
            Play
          </button>
          <button className="banner__button">My List</button>
        </div>
        <p className="banner__description">{truncateString(movie?.overview, 170)}</p>
      </div>
      <div className="fade__buttom"></div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </header>
  );
}

export default Banner;
