import React from "react";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import {
  getWatchlist,
  removeFromWatchlist,
} from "../services/watchlist";

function Watchlist() {
  const [movies, setMovies] =
    useState([]);

  useEffect(() => {
    setMovies(getWatchlist());
  }, []);

  const removeMovie = (id) => {
    removeFromWatchlist(id);

    setMovies(
      getWatchlist()
    );
  };

  return (
    <>
      <Navbar />

      <div className="watchlist_page">
        <h1>My Watchlist</h1>

        {movies.length === 0 ? (
          <h2 className="empty_watchlist">
            No content in your
            watchlist
          </h2>
        ) : (
          <div className="watchlist_grid">
            {movies.map((movie) => (
              <div
                className="watch_card"
                key={movie.id}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={
                    movie.title ||
                    movie.name
                  }
                />

                <h3>
                  {movie.title ||
                    movie.name}
                </h3>

                <button
                  onClick={() =>
                    removeMovie(
                      movie.id
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Watchlist;