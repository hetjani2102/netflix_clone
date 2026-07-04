import React, {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import api from "../services/api";
import { API_KEY } from "../services/requests";

import { addToWatchlist } from "../services/watchlist";

function MovieDetails() {
  const { id, type } =
    useParams();
    const [seasonData, setSeasonData] =
  useState(null);

const [selectedSeason, setSelectedSeason] =
  useState(1);

  const [movie, setMovie] =
    useState(null);

  useEffect(() => {
    async function fetchMovie() {
  try {
    const res = await api.get(
      `/${type}/${id}?api_key=${API_KEY}`
    );

    setMovie(res.data);

    if (type === "tv") {
      const seasonRes =
        await api.get(
          `/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}`
        );

      setSeasonData(
        seasonRes.data
      );
    }
  } catch (error) {
    console.log(error);
  }
}
    fetchMovie();
  }, [
  id,
  type,
  selectedSeason,
]);

  if (!movie) {
    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="movie_details">
      <div
        className="details_hero"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "",
        }}
      >
        <div className="hero_gradient">
          <div className="hero_content">
            <h1>
              {movie.title ||
                movie.name}
            </h1>

            <div className="movie_meta">
              <span>
                ⭐{" "}
                {movie.vote_average?.toFixed(
                  1
                )}
              </span>

              <span>
                {movie.release_date ||
                  movie.first_air_date}
              </span>

              {type === "movie" ? (
                <span>
                  {movie.runtime} min
                </span>
              ) : (
                <>
                  <span>
                    {
                      movie.number_of_seasons
                    }{" "}
                    Seasons
                  </span>

                  <span>
                    {
                      movie.number_of_episodes
                    }{" "}
                    Episodes
                  </span>
                </>
              )}
            </div>

            <div className="genres">
              {movie.genres?.map(
                (genre) => (
                  <span
                    key={genre.id}
                  >
                    {genre.name}
                  </span>
                )
              )}
            </div>

            <div className="movie_buttons">
              <button className="play_btn">
                ▶ Play
              </button>

              <button
                className="info_btn"
                onClick={() => {
                  addToWatchlist(
                    movie
                  );

                  alert(
                    "Added to Watchlist"
                  );
                }}
              >
                + Watchlist
              </button>
            </div>
            {type === "tv" && (
  <div
    style={{
      marginBottom: "20px",
    }}
  >
    <select
      value={
        selectedSeason
      }
      onChange={(e) =>
        setSelectedSeason(
          e.target.value
        )
      }
    >
      {movie.seasons?.map(
        (season) => (
          <option
            key={season.id}
            value={
              season.season_number
            }
          >
            {season.name}
          </option>
        )
      )}
    </select>
  </div>
)}

            <p className="overview">
              {movie.overview}
            </p>
            {type === "tv" &&
  seasonData?.episodes && (
    <div className="episodes_section">
      <h2>
        Episodes
      </h2>

      {seasonData.episodes.map(
        (episode) => (
          <div
            key={
              episode.id
            }
            className="episode_card"
          >
            <h3>
              Episode{" "}
              {
                episode.episode_number
              }
              : {episode.name}
            </h3>

            <p>
              {
                episode.overview
              }
            </p>
          </div>
        )
      )}
    </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;