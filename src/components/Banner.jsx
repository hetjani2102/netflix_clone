import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import requests from "../services/requests";

function Banner() {
  const [movie, setMovie] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(
          requests.fetchTrending
        );

        const randomMovie =
          res.data.results[
            Math.floor(
              Math.random() *
                res.data.results.length
            )
          ];

        setMovie(randomMovie);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <header
      className="banner"
      style={{
        backgroundImage: movie
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : "",
      }}
    >
      <div className="banner_overlay">
        <h1>
          {movie?.title ||
            movie?.name}
        </h1>

        <p>
          {movie?.overview?.length >
          180
            ? movie.overview.substring(
                0,
                180
              ) + "..."
            : movie?.overview}
        </p>

        <div className="hero_buttons">
          <button className="play_btn">
            ▶ Play
          </button>

          <button
            className="info_btn"
            onClick={() =>
              navigate(
                `/movie/${movie.id}/${
                  movie?.first_air_date
                    ? "tv"
                    : "movie"
                }`
              )
            }
          >
            ℹ More Info
          </button>
        </div>
      </div>
    </header>
  );
}

export default Banner;