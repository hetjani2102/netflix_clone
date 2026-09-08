import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Info, Volume2, VolumeX, Plus, Check, RotateCcw } from "lucide-react";
import YouTube from "react-youtube";
import api from "../services/api";
import requests, { API_KEY } from "../services/requests";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "../services/storage";
import { showToast } from "./Toast";

function Banner({ onOpenModal }) {
  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [inList, setInList] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const navigate = useNavigate();
  const playerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(requests.fetchTrending);
        const results = res.data.results.filter((m) => m.backdrop_path);
        const randomMovie = results[Math.floor(Math.random() * results.length)];
        setMovie(randomMovie);
        setInList(isInWatchlist(randomMovie?.id));

        // Fetch official trailer for ambient background preview
        const type = randomMovie?.first_air_date ? "tv" : "movie";
        const vRes = await api.get(`/${type}/${randomMovie.id}/videos?api_key=${API_KEY}`).catch(() => null);
        const vids = vRes?.data?.results || [];
        const trailer =
          vids.find((v) => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube") ||
          vids.find((v) => v.site === "YouTube");

        if (trailer) {
          // Delay video playback slightly for polished fade-in effect
          setTimeout(() => {
            setVideoKey(trailer.key);
          }, 1800);
        }
      } catch (error) {
        console.error("Banner fetch error", error);
      }
    }

    fetchData();
  }, []);

  const mediaType = movie?.first_air_date ? "tv" : "movie";

  const handleWatchlist = () => {
    if (!movie) return;
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

  const handlePlayerReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.mute();
    playerRef.current.playVideo();
    setIsVideoPlaying(true);
  };

  const toggleSound = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(70);
      setIsMuted(false);
      showToast("Audio unmuted", "info");
    } else {
      playerRef.current.mute();
      setIsMuted(true);
      showToast("Audio muted", "info");
    }
  };

  const restartVideo = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
    playerRef.current.playVideo();
    setVideoEnded(false);
    setIsVideoPlaying(true);
  };

  const matchPercent = Math.min(99, Math.max(82, Math.round((movie?.vote_average || 8.1) * 10 + 10)));

  return (
    <header
      className="ott_banner"
      style={{
        backgroundImage: movie?.backdrop_path
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : "",
      }}
    >
      {/* Ambient Video Trailer Background */}
      {videoKey && !videoEnded && (
        <div className={`banner_video_bg ${isVideoPlaying ? "playing" : ""}`}>
          <YouTube
            videoId={videoKey}
            onReady={handlePlayerReady}
            onEnd={() => {
              setVideoEnded(true);
              setIsVideoPlaying(false);
            }}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 1,
                controls: 0,
                mute: 1,
                loop: 1,
                playlist: videoKey,
                modestbranding: 1,
                showinfo: 0,
                rel: 0,
                disablekb: 1,
              },
            }}
            className="banner_yt_frame"
          />
        </div>
      )}

      {/* Multi-stop cinematic gradient vignette */}
      <div className="ott_banner_vignette" />

      {/* Foreground Content */}
      <div className="ott_banner_content">
        <div className="banner_brand_tag">
          <span className="brand_icon">M</span>
          <span className="brand_series">
            {mediaType === "tv" ? "SERIES" : "FILM"}
          </span>
        </div>

        <h1 className="banner_title">{movie?.title || movie?.name}</h1>

        <div className="banner_top10_badge">
          <div className="top10_square">TOP 10</div>
          <span>#1 in Trending Titles Today</span>
        </div>

        <div className="banner_meta_row">
          <span className="match_score">{matchPercent}% Match</span>
          <span className="meta_pill">16+</span>
          <span className="meta_pill">4K UHD</span>
          <span className="meta_pill">5.1 Audio</span>
          <span className="release_year">
            {(movie?.release_date || movie?.first_air_date || "").slice(0, 4)}
          </span>
        </div>

        <p className="banner_description">
          {movie?.overview?.length > 220
            ? movie.overview.substring(0, 220) + "..."
            : movie?.overview}
        </p>

        <div className="banner_btn_group">
          <button
            className="banner_btn_play"
            onClick={() => navigate(`/watch/${movie.id}/${mediaType}`)}
          >
            <Play size={22} fill="currentColor" /> Play Now
          </button>

          <button
            className="banner_btn_info"
            onClick={() => onOpenModal && onOpenModal(movie)}
          >
            <Info size={22} /> More Info
          </button>

          <button
            className={`banner_btn_icon ${inList ? "active" : ""}`}
            onClick={handleWatchlist}
            title={inList ? "Remove from My List" : "Add to My List"}
          >
            {inList ? <Check size={20} /> : <Plus size={20} />}
          </button>
        </div>
      </div>

      {/* Right side live sound toggle & rating tag */}
      <div className="banner_right_badges">
        {videoKey && !videoEnded && (
          <button
            className="banner_sound_btn"
            onClick={toggleSound}
            aria-label="Toggle Sound"
            title={isMuted ? "Unmute Preview" : "Mute Preview"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}

        {videoEnded && (
          <button
            className="banner_sound_btn"
            onClick={restartVideo}
            title="Replay Video Preview"
          >
            <RotateCcw size={18} />
          </button>
        )}

        <span className="banner_age_tag">16+</span>
      </div>
    </header>
  );
}

export default Banner;