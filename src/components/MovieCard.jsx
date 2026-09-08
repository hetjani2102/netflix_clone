import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Check, ThumbsUp, ChevronDown, Star } from "lucide-react";
import { addToWatchlist, removeFromWatchlist, isInWatchlist, toggleLike, isLiked } from "../services/storage";
import { showToast } from "./Toast";

function MovieCard({
  movie,
  rank,
  isLarge = false,
  isBackdrop = false,
  onOpenModal,
}) {
  const navigate = useNavigate();
  const [inList, setInList] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mediaType = movie.first_air_date || movie.number_of_seasons ? "tv" : "movie";

  useEffect(() => {
    setInList(isInWatchlist(movie.id));
    setLiked(isLiked(movie.id));
  }, [movie.id]);

  const handleWatchlist = (e) => {
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(movie.id);
      setInList(false);
      showToast("Removed from My List", "info");
    } else {
      addToWatchlist(movie);
      setInList(true);
      showToast("Added to My List", "success");
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    const updated = toggleLike(movie.id);
    setLiked(updated);
    showToast(updated ? "Added to Liked" : "Removed from Liked", "success");
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

  const imagePath = isBackdrop && movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : "https://via.placeholder.com/300x450?text=No+Poster";

  const matchPercent = Math.min(99, Math.max(76, Math.round((movie.vote_average || 7.8) * 10 + 14)));

  return (
    <div
      className={`ott_card ${isLarge ? "card_large" : ""} ${isBackdrop ? "card_backdrop" : ""} ${
        rank ? "card_top10" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOpenDetails}
    >
      {/* Giant Top 10 Number */}
      {rank && (
        <div className="top10_rank_num">
          <svg viewBox="0 0 100 120" className="rank_svg">
            <text x="50%" y="85%" textAnchor="middle" className="rank_text">
              {rank}
            </text>
          </svg>
        </div>
      )}

      {/* Media Image */}
      <div className="card_img_wrapper">
        <img
          src={imagePath}
          alt={movie.title || movie.name}
          className="card_image"
          loading="lazy"
        />

        {/* Continue Watching progress bar */}
        {movie.progress !== undefined && (
          <div className="card_continue_progress">
            <div
              className="card_progress_bar"
              style={{ width: `${movie.progress}%` }}
            />
          </div>
        )}

        {/* Brand original badge */}
        {rank && rank <= 3 && (
          <div className="card_corner_badge">TOP 10</div>
        )}
      </div>

      {/* Hover Card Mini-Details (OTT style) */}
      <div className="card_hover_details">
        <div className="card_quick_actions">
          <div className="actions_left">
            <button
              className="action_circle_btn play"
              onClick={handlePlay}
              title="Play"
            >
              <Play size={16} fill="black" />
            </button>
            <button
              className={`action_circle_btn ${inList ? "active" : ""}`}
              onClick={handleWatchlist}
              title={inList ? "In My List" : "Add to My List"}
            >
              {inList ? <Check size={16} /> : <Plus size={16} />}
            </button>
            <button
              className={`action_circle_btn ${liked ? "active" : ""}`}
              onClick={handleLike}
              title="I like this"
            >
              <ThumbsUp size={15} fill={liked ? "white" : "none"} />
            </button>
          </div>

          <button
            className="action_circle_btn more_info"
            onClick={handleOpenDetails}
            title="More details"
          >
            <ChevronDown size={18} />
          </button>
        </div>

        <div className="card_mini_meta">
          <span className="card_match">{matchPercent}% Match</span>
          <span className="card_badge_age">16+</span>
          <span className="card_badge_quality">HD</span>
        </div>

        <h4 className="card_title">{movie.title || movie.name}</h4>

        <div className="card_genre_line">
          <span>{mediaType === "tv" ? "TV Series" : "Movie"}</span>
          <span>•</span>
          <span>Trending</span>
          <span>•</span>
          <span>Popular</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;