import React from "react";
import { useEffect, useState } from "react";
import api from "../services/api";
import MovieCard from "./MovieCard";
import TrailerModal from "./TrailerModal";
import movieTrailer from "movie-trailer";

function Row({ title, fetchUrl }) {
  const [movies, setMovies] = useState([]);

  const [trailerUrl, setTrailerUrl] =
    useState("");

  useEffect(() => {
    async function fetchMovies() {
      const res = await api.get(fetchUrl);

      setMovies(res.data.results);
    }

    fetchMovies();
  }, [fetchUrl]);

  const handleClick = async (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
      return;
    }

    try {
      const url = await movieTrailer(
        movie?.title || movie?.name || ""
      );

      const params = new URLSearchParams(
        new URL(url).search
      );

      setTrailerUrl(params.get("v"));
    } catch {
      alert("Trailer not found");
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row_container">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleClick(movie)}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {trailerUrl && (
        <TrailerModal
          trailerUrl={trailerUrl}
          closeModal={() =>
            setTrailerUrl("")
          }
        />
      )}
    </div>
  );
}

export default Row;