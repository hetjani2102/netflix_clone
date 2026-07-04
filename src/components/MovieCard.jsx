import React from "react";
import { useNavigate } from "react-router-dom";

import { addToWatchlist } from "../services/watchlist";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const mediaType =
    movie.first_air_date
      ? "tv"
      : "movie";

  return (
    <div className="card">
      <img
        onClick={() =>
          navigate(
            `/movie/${movie.id}/${mediaType}`
          )
        }
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={
          movie.title ||
          movie.name
        }
      />

      <div className="card_info">
        <h4>
          {movie.title ||
            movie.name}
        </h4>

        <button
          onClick={(e) => {
            e.stopPropagation();

            addToWatchlist(movie);

            alert(
              "Added to Watchlist"
            );
          }}
        >
          + Watchlist
        </button>
      </div>
    </div>
  );
}

export default MovieCard;