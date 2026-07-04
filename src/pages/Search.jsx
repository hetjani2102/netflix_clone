import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { API_KEY } from "../services/requests";

import Navbar from "../components/Navbar";

function Search() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const navigate = useNavigate();

  const searchMovie = async (value) => {
    setQuery(value);

    if (!value.trim()) {
      setMovies([]);
      return;
    }

    try {
     const res = await api.get(
  `/search/multi?api_key=${API_KEY}&query=${value}`
);

      setMovies(res.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="search_page">
        <input
          type="text"
          placeholder="Search Movies and Series"
          value={query}
          onChange={(e) =>
            searchMovie(e.target.value)
          }
        />

        <div className="search_grid">
          {movies.map((movie) => {
            const mediaType =
  movie.media_type === "tv"
    ? "tv"
    : "movie";

            return (
              <div
                className="search_card"
                key={movie.id}
                onClick={() =>
                  navigate(
                    `/movie/${movie.id}/${mediaType}`
                  )
                }
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={
                    movie.title ||
                    movie.name
                  }
                />

              <h4>
  {movie.title || movie.name}
</h4>

<p className="media_type">
  {movie.media_type === "tv"
    ? "TV Show"
    : movie.media_type === "movie"
    ? "Movie"
    : ""}
</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Search;