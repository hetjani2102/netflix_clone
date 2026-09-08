import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Play, Plus, Check, ThumbsUp, Volume2, VolumeX, Star, Clock, Calendar, Film } from "lucide-react";
import YouTube from "react-youtube";
import api from "../services/api";
import { API_KEY } from "../services/requests";
import { addToWatchlist, removeFromWatchlist, isInWatchlist, toggleLike, isLiked } from "../services/storage";
import { showToast } from "./Toast";

function MediaModal({ media, onClose, onSelectMedia }) {
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  const [inList, setInList] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview, episodes, trailers, more
  const [muted, setMuted] = useState(true);

  const navigate = useNavigate();

  const id = media?.id;
  const type = media?.first_air_date || media?.number_of_seasons ? "tv" : "movie";

  useEffect(() => {
    if (!id) return;

    setInList(isInWatchlist(id));
    setLiked(isLiked(id));

    async function fetchAllDetails() {
      try {
        const [detailsRes, creditsRes, videosRes, similarRes] = await Promise.all([
          api.get(`/${type}/${id}?api_key=${API_KEY}`),
          api.get(`/${type}/${id}/credits?api_key=${API_KEY}`).catch(() => ({ data: { cast: [] } })),
          api.get(`/${type}/${id}/videos?api_key=${API_KEY}`).catch(() => ({ data: { results: [] } })),
          api.get(`/${type}/${id}/recommendations?api_key=${API_KEY}`).catch(() => ({ data: { results: [] } })),
        ]);

        setDetails(detailsRes.data);
        setCredits(creditsRes.data);
        setVideos(videosRes.data?.results || []);
        setSimilar(similarRes.data?.results?.slice(0, 8) || []);

        if (type === "tv") {
          const sRes = await api.get(`/tv/${id}/season/1?api_key=${API_KEY}`);
          setSeasonData(sRes.data);
        }
      } catch (err) {
        console.error("Error loading modal details", err);
      }
    }

    fetchAllDetails();
  }, [id, type]);

  useEffect(() => {
    if (type !== "tv" || !id) return;
    async function fetchSeason() {
      try {
        const res = await api.get(`/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}`);
        setSeasonData(res.data);
      } catch (err) {
        console.error("Error fetching season", err);
      }
    }
    fetchSeason();
  }, [selectedSeason, id, type]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!media) return null;

  const trailerVideo = videos.find(
    (v) => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
  ) || videos[0];

  const handleWatchlistToggle = () => {
    if (inList) {
      removeFromWatchlist(media.id);
      setInList(false);
      showToast("Removed from My List", "info");
    } else {
      addToWatchlist(details || media);
      setInList(true);
      showToast("Added to My List", "success");
    }
  };

  const handleLikeToggle = () => {
    const isNowLiked = toggleLike(media.id);
    setLiked(isNowLiked);
    showToast(isNowLiked ? "Rated: I like this!" : "Reaction removed", "success");
  };

  const startPlayback = (seasonNum, episodeNum) => {
    onClose();
    if (type === "tv" && seasonNum) {
      navigate(`/watch/${media.id}/tv?season=${seasonNum}&episode=${episodeNum || 1}`);
    } else {
      navigate(`/watch/${media.id}/${type}`);
    }
  };

  const matchPercent = Math.min(99, Math.max(78, Math.round((details?.vote_average || 8.0) * 10 + 12)));

  return (
    <div className="ott_modal_backdrop" onClick={onClose}>
      <div className="ott_modal_content" onClick={(e) => e.stopPropagation()}>
        <button className="ott_modal_close" onClick={onClose} aria-label="Close modal">
          <X size={22} />
        </button>

        {/* Modal Header / Video Banner */}
        <div className="ott_modal_hero">
          <img
            src={`https://image.tmdb.org/t/p/original${
              details?.backdrop_path || media.backdrop_path || media.poster_path
            }`}
            alt={media.title || media.name}
            className="ott_modal_hero_img"
          />
          <div className="ott_modal_hero_gradient" />

          <div className="ott_modal_hero_overlay">
            <div className="ott_original_badge">
              <span className="badge_n">M</span>
              <span>ORIGINAL</span>
            </div>
            <h2 className="ott_modal_title">{details?.title || details?.name || media.title || media.name}</h2>

            <div className="ott_modal_actions">
              <button
                className="ott_btn_primary"
                onClick={() => startPlayback(1, 1)}
              >
                <Play size={20} fill="currentColor" /> Play
              </button>

              <button
                className={`ott_icon_action_btn ${inList ? "active" : ""}`}
                onClick={handleWatchlistToggle}
                title={inList ? "Remove from My List" : "Add to My List"}
              >
                {inList ? <Check size={20} /> : <Plus size={20} />}
              </button>

              <button
                className={`ott_icon_action_btn ${liked ? "active" : ""}`}
                onClick={handleLikeToggle}
                title="I like this"
              >
                <ThumbsUp size={19} fill={liked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="ott_modal_body">
          {/* Metadata Badges */}
          <div className="ott_modal_meta_row">
            <div className="meta_left">
              <span className="ott_match_badge">{matchPercent}% Match</span>
              <span className="ott_year_badge">
                {(details?.release_date || details?.first_air_date || "").slice(0, 4)}
              </span>
              <span className="ott_age_badge">16+</span>
              <span className="ott_quality_badge">4K Ultra HD</span>
              <span className="ott_audio_badge">5.1 Atmos</span>
              {type === "movie" ? (
                <span className="ott_duration">{details?.runtime ? `${details.runtime}m` : "2h 12m"}</span>
              ) : (
                <span className="ott_duration">
                  {details?.number_of_seasons || 1} {details?.number_of_seasons === 1 ? "Season" : "Seasons"}
                </span>
              )}
            </div>

            <div className="meta_right">
              {details?.genres && (
                <div className="ott_genre_tags">
                  {details.genres.slice(0, 3).map((g) => (
                    <span key={g.id} className="genre_pill">{g.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="ott_modal_tabs">
            <button
              className={`tab_btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview & Cast
            </button>
            {type === "tv" && (
              <button
                className={`tab_btn ${activeTab === "episodes" ? "active" : ""}`}
                onClick={() => setActiveTab("episodes")}
              >
                Episodes
              </button>
            )}
            {videos.length > 0 && (
              <button
                className={`tab_btn ${activeTab === "trailers" ? "active" : ""}`}
                onClick={() => setActiveTab("trailers")}
              >
                Trailers & Clips ({videos.length})
              </button>
            )}
            {similar.length > 0 && (
              <button
                className={`tab_btn ${activeTab === "more" ? "active" : ""}`}
                onClick={() => setActiveTab("more")}
              >
                More Like This
              </button>
            )}
          </div>

          {/* Tab 1: Overview & Cast */}
          {activeTab === "overview" && (
            <div className="ott_tab_overview">
              <p className="ott_synopsis">{details?.overview || media.overview}</p>

              {credits?.cast && credits.cast.length > 0 && (
                <div className="ott_cast_section">
                  <h3>Top Cast</h3>
                  <div className="ott_cast_grid">
                    {credits.cast.slice(0, 6).map((actor) => (
                      <div key={actor.id} className="cast_card">
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                              : "https://via.placeholder.com/100x100?text=Actor"
                          }
                          alt={actor.name}
                          className="cast_img"
                        />
                        <p className="cast_name">{actor.name}</p>
                        <p className="cast_char">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Episodes Browser (for TV Shows) */}
          {activeTab === "episodes" && type === "tv" && (
            <div className="ott_tab_episodes">
              <div className="season_selector_header">
                <h3>Episodes</h3>
                {details?.seasons && (
                  <select
                    className="ott_season_select"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  >
                    {details.seasons
                      .filter((s) => s.season_number > 0)
                      .map((season) => (
                        <option key={season.id} value={season.season_number}>
                          Season {season.season_number} ({season.episode_count} Episodes)
                        </option>
                      ))}
                  </select>
                )}
              </div>

              <div className="ott_episodes_list">
                {seasonData?.episodes ? (
                  seasonData.episodes.map((ep) => (
                    <div
                      key={ep.id}
                      className="ott_episode_item"
                      onClick={() => startPlayback(selectedSeason, ep.episode_number)}
                    >
                      <span className="ep_number">{ep.episode_number}</span>
                      <div className="ep_thumb_box">
                        <img
                          src={
                            ep.still_path
                              ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                              : `https://image.tmdb.org/t/p/w300${details?.backdrop_path}`
                          }
                          alt={ep.name}
                          className="ep_thumbnail"
                        />
                        <div className="ep_play_overlay">
                          <Play size={20} fill="white" />
                        </div>
                      </div>
                      <div className="ep_info">
                        <div className="ep_title_row">
                          <h4>{ep.name}</h4>
                          <span className="ep_runtime">{ep.runtime ? `${ep.runtime}m` : "48m"}</span>
                        </div>
                        <p className="ep_overview">
                          {ep.overview || "No episode description available at this moment."}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="loading_text">Loading episodes...</div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Trailers & Clips */}
          {activeTab === "trailers" && (
            <div className="ott_tab_trailers">
              <div className="trailers_grid">
                {videos.slice(0, 4).map((vid) => (
                  <div key={vid.id} className="trailer_item">
                    <div className="trailer_player_wrapper">
                      <YouTube
                        videoId={vid.key}
                        opts={{
                          width: "100%",
                          height: "220",
                          playerVars: { autoplay: 0 },
                        }}
                      />
                    </div>
                    <p className="trailer_name">{vid.name}</p>
                    <span className="trailer_type">{vid.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: More Like This */}
          {activeTab === "more" && (
            <div className="ott_tab_more">
              <div className="more_like_this_grid">
                {similar.map((item) => (
                  <div
                    key={item.id}
                    className="similar_card"
                    onClick={() => {
                      if (onSelectMedia) {
                        onSelectMedia(item);
                      }
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`}
                      alt={item.title || item.name}
                    />
                    <div className="similar_card_overlay">
                      <h4>{item.title || item.name}</h4>
                      <p>⭐ {item.vote_average?.toFixed(1)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaModal;
