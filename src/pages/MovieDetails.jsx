import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Plus, Check, ThumbsUp, Star, Clock, Calendar, ArrowLeft } from "lucide-react";
import YouTube from "react-youtube";
import Navbar from "../components/Navbar";
import ToastContainer, { showToast } from "../components/Toast";
import api from "../services/api";
import { API_KEY } from "../services/requests";
import { addToWatchlist, removeFromWatchlist, isInWatchlist, toggleLike, isLiked } from "../services/storage";

function MovieDetails() {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [seasonData, setSeasonData] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [inList, setInList] = useState(false);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [movieRes, creditsRes, videosRes, similarRes] = await Promise.all([
          api.get(`/${type}/${id}?api_key=${API_KEY}`),
          api.get(`/${type}/${id}/credits?api_key=${API_KEY}`).catch(() => ({ data: { cast: [] } })),
          api.get(`/${type}/${id}/videos?api_key=${API_KEY}`).catch(() => ({ data: { results: [] } })),
          api.get(`/${type}/${id}/recommendations?api_key=${API_KEY}`).catch(() => ({ data: { results: [] } })),
        ]);

        setMovie(movieRes.data);
        setCredits(creditsRes.data);
        setVideos(videosRes.data?.results || []);
        setSimilar(similarRes.data?.results || []);
        setInList(isInWatchlist(id));
        setLiked(isLiked(id));

        if (type === "tv") {
          const sRes = await api.get(`/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}`);
          setSeasonData(sRes.data);
        }
      } catch (error) {
        console.error("Failed to load details", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [id, type]);

  useEffect(() => {
    if (type !== "tv") return;
    async function fetchSeason() {
      try {
        const res = await api.get(`/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}`);
        setSeasonData(res.data);
      } catch (err) {
        console.error("Season fetch error", err);
      }
    }
    fetchSeason();
  }, [selectedSeason, id, type]);

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

  const handleLike = () => {
    const isNowLiked = toggleLike(movie.id);
    setLiked(isNowLiked);
    showToast(isNowLiked ? "Rated: I like this!" : "Reaction removed", "success");
  };

  const playMedia = (seasonNum, epNum) => {
    if (type === "tv" && seasonNum) {
      navigate(`/watch/${id}/tv?season=${seasonNum}&episode=${epNum || 1}`);
    } else {
      navigate(`/watch/${id}/${type}`);
    }
  };

  if (loading || !movie) {
    return (
      <div className="ott_loading_screen">
        <div className="ott_spinner" />
        <p>Loading title details...</p>
      </div>
    );
  }

  const matchPercent = Math.min(99, Math.max(78, Math.round((movie.vote_average || 8.0) * 10 + 12)));

  return (
    <div className="ott_details_page">
      <Navbar />
      <ToastContainer />

      {/* Hero Backdrop Banner */}
      <div
        className="details_hero_banner"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "",
        }}
      >
        <div className="details_hero_overlay">
          <div className="details_content_wrapper">
            <button className="details_back_btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Back
            </button>

            <div className="ott_original_badge">
              <span className="badge_n">M</span>
              <span>{type === "tv" ? "SERIES" : "FILM"}</span>
            </div>

            <h1 className="details_title">{movie.title || movie.name}</h1>

            <div className="details_meta_row">
              <span className="ott_match_badge">{matchPercent}% Match</span>
              <span className="ott_year_badge">
                {(movie.release_date || movie.first_air_date || "").slice(0, 4)}
              </span>
              <span className="ott_age_badge">16+</span>
              <span className="ott_quality_badge">4K ULTRA HD</span>
              <span className="ott_audio_badge">5.1 ATMOS</span>
              {type === "movie" ? (
                <span className="ott_duration">{movie.runtime ? `${movie.runtime}m` : "2h 15m"}</span>
              ) : (
                <span className="ott_duration">
                  {movie.number_of_seasons} {movie.number_of_seasons === 1 ? "Season" : "Seasons"}
                </span>
              )}
            </div>

            <div className="details_genre_tags">
              {movie.genres?.map((g) => (
                <span key={g.id} className="genre_pill">
                  {g.name}
                </span>
              ))}
            </div>

            <div className="details_actions_row">
              <button className="banner_btn_play" onClick={() => playMedia(1, 1)}>
                <Play size={22} fill="currentColor" /> Play Now
              </button>

              <button
                className={`ott_icon_action_btn ${inList ? "active" : ""}`}
                onClick={handleWatchlist}
                title={inList ? "Remove from My List" : "Add to My List"}
              >
                {inList ? <Check size={22} /> : <Plus size={22} />}
              </button>

              <button
                className={`ott_icon_action_btn ${liked ? "active" : ""}`}
                onClick={handleLike}
                title="I like this"
              >
                <ThumbsUp size={20} fill={liked ? "white" : "none"} />
              </button>
            </div>

            <p className="details_overview">{movie.overview}</p>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="details_body_container">
        {/* Cast & Crew Carousel */}
        {credits?.cast && credits.cast.length > 0 && (
          <div className="details_section">
            <h2 className="section_header">Cast & Crew</h2>
            <div className="details_cast_row">
              {credits.cast.slice(0, 10).map((actor) => (
                <div key={actor.id} className="details_actor_card">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : "https://via.placeholder.com/150x225?text=Actor"
                    }
                    alt={actor.name}
                  />
                  <p className="actor_name">{actor.name}</p>
                  <p className="character_name">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TV Series Episode Guide */}
        {type === "tv" && (
          <div className="details_section">
            <div className="season_selector_header">
              <h2 className="section_header">Episodes</h2>
              {movie.seasons && (
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  className="ott_season_select"
                >
                  {movie.seasons
                    .filter((s) => s.season_number > 0)
                    .map((s) => (
                      <option key={s.id} value={s.season_number}>
                        Season {s.season_number} ({s.episode_count} Episodes)
                      </option>
                    ))}
                </select>
              )}
            </div>

            <div className="ott_episodes_list">
              {seasonData?.episodes?.map((ep) => (
                <div
                  key={ep.id}
                  className="ott_episode_item"
                  onClick={() => playMedia(selectedSeason, ep.episode_number)}
                >
                  <span className="ep_number">{ep.episode_number}</span>
                  <div className="ep_thumb_box">
                    <img
                      src={
                        ep.still_path
                          ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                          : `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`
                      }
                      alt={ep.name}
                      className="ep_thumbnail"
                    />
                    <div className="ep_play_overlay">
                      <Play size={22} fill="white" />
                    </div>
                  </div>
                  <div className="ep_info">
                    <div className="ep_title_row">
                      <h4>{ep.name}</h4>
                      <span className="ep_runtime">{ep.runtime ? `${ep.runtime}m` : "48m"}</span>
                    </div>
                    <p className="ep_overview">
                      {ep.overview || "No episode synopsis provided."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Official Trailers & Teasers */}
        {videos.length > 0 && (
          <div className="details_section">
            <h2 className="section_header">Official Trailers & Teasers</h2>
            <div className="details_trailers_grid">
              {videos.slice(0, 3).map((vid) => (
                <div key={vid.id} className="trailer_embed_box">
                  <YouTube
                    videoId={vid.key}
                    opts={{
                      width: "100%",
                      height: "220",
                      playerVars: { autoplay: 0 },
                    }}
                  />
                  <p className="trailer_clip_title">{vid.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* More Like This */}
        {similar.length > 0 && (
          <div className="details_section">
            <h2 className="section_header">More Like This</h2>
            <div className="details_similar_grid">
              {similar.slice(0, 12).map((item) => (
                <div
                  key={item.id}
                  className="similar_poster_card"
                  onClick={() => navigate(`/movie/${item.id}/${type}`)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w400${item.poster_path || item.backdrop_path}`}
                    alt={item.title || item.name}
                  />
                  <div className="similar_poster_info">
                    <h4>{item.title || item.name}</h4>
                    <span>⭐ {item.vote_average?.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;