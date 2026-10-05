import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Check, Star, X, Info } from "lucide-react";
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  removeFromContinueWatching,
} from "../services/storage";
import { showToast } from "./Toast";

function MovieCard({
  movie,
  rank,
  isLarge = false,
  isBackdrop = false,
  isContinueWatching = false,
  onRemoveContinueWatching,
  onOpenModal,
}) {
  const navigate = useNavigate();
  const [inList, setInList] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mediaType = movie.first_air_date || movie.number_of_seasons ? "tv" : "movie";

  useEffect(() => {
    setInList(isInWatchlist(movie.id));
  }, [movie.id]);

  const handleWatchlist = (e) => {
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(movie.id);
      setInList(false);
      showToast("Removed from Watchlist", "info");
    } else {
      addToWatchlist(movie);
      setInList(true);
      showToast("Added to Watchlist", "success");
    }
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    navigate(`/watch/${movie.id}/${mediaType}`);
  };

  const handleOpenDetails = (e) => {
    e.stopPropagation();
    if (onOpenModal) {
      onOpenModal(movie);
    } else {
      navigate(`/movie/${movie.id}/${mediaType}`);
    }
  };

  const handleRemoveFromContinue = (e) => {
    e.stopPropagation();
    removeFromContinueWatching(movie.id);
    showToast("Removed from Continue Watching", "info");
    if (onRemoveContinueWatching) {
      onRemoveContinueWatching(movie.id);
    }
  };

  const imagePath = isBackdrop && movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : "https://via.placeholder.com/300x450?text=No+Poster";

  const ratingScore = movie.vote_average ? movie.vote_average.toFixed(1) : "7.9";
  const releaseYear = (movie.release_date || movie.first_air_date || "2024").slice(0, 4);

  return (
    <div
      className={`cinema_card ${isLarge ? "card_large" : ""} ${isBackdrop ? "card_landscape" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOpenDetails}
    >
      {/* Visual Poster Container */}
      <div className="card_visual_box">
        <img
          src={imagePath}
          alt={movie.title || movie.name}
          className="card_visual_img"
          loading="lazy"
        />

        {/* Rank Badge for Trending/Top 10 - Modern Clean Ribbon */}
        {rank && (
          <div className="card_rank_ribbon">
            <span className="rank_hash">#</span>
            <span className="rank_digit">{rank}</span>
          </div>
        )}

        {/* 4K UHD Tag */}
        <span className="card_quality_pill">4K UHD</span>

        {/* Continue Watching: Explicit Remove Button */}
        {(isContinueWatching || movie.progress !== undefined) && (
          <button
            className="card_dismiss_btn"
            onClick={handleRemoveFromContinue}
            title="Remove from Continue Watching"
            aria-label="Remove from Continue Watching"
          >
            <X size={14} />
          </button>
        )}

        {/* Hover Action Overlay (Clean Cinema Style: Play & Watchlist, no messy circular cluster) */}
        <div className={`card_action_overlay ${isHovered ? "active" : ""}`}>
          <button className="overlay_play_btn" onClick={handlePlay}>
            <Play size={18} fill="currentColor" />
            <span>Play</span>
          </button>

          <div className="overlay_secondary_actions">
            <button
              className={`overlay_icon_btn ${inList ? "active" : ""}`}
              onClick={handleWatchlist}
              title={inList ? "In Watchlist" : "Add to Watchlist"}
            >
              {inList ? <Check size={16} /> : <Plus size={16} />}
            </button>

            <button
              className="overlay_icon_btn"
              onClick={handleOpenDetails}
              title="More Details"
            >
              <Info size={16} />
            </button>
          </div>
        </div>

        {/* Continue Watching Progress Bar */}
        {movie.progress !== undefined && (
          <div className="card_playback_progress_bar">
            <div
              className="card_progress_fill"
              style={{ width: `${movie.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Card Info Box - Cleanly Positioned Below Card */}
      <div className="card_info_box">
        <h4 className="card_movie_title" title={movie.title || movie.name}>
          {movie.title || movie.name}
        </h4>

        <div className="card_meta_row">
          <span className="card_rating_pill">
            <Star size={11} className="star_icon" fill="currentColor" />
            {ratingScore}
          </span>
          <span className="card_meta_divider">•</span>
          <span className="card_meta_year">{releaseYear}</span>
          <span className="card_meta_divider">•</span>
          <span className="card_meta_genre">
            {mediaType === "tv" ? "TV Series" : "Movie"}
          </span>

          {movie.progress !== undefined && (
            <span className="card_remaining_tag">
              {Math.max(10, Math.round((100 - movie.progress) * 0.9))}m left
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieCard;