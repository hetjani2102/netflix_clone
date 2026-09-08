import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  ListVideo,
  FastForward,
  MessageSquare,
  Gauge,
  Check,
  Server,
  ChevronDown,
  Tv,
  Film,
  Sparkles,
  Link2,
} from "lucide-react";
import YouTube from "react-youtube";
import api from "../services/api";
import { API_KEY } from "../services/requests";
import { saveProgress } from "../services/storage";
import { showToast } from "../components/Toast";

const SERVERS = [
  {
    id: "vidsrc",
    name: "Server 1: VidSrc (Full Movie/Series)",
    tag: "HD • Fast",
    isEmbed: true,
    getUrl: (id, type, s, e) =>
      type === "tv"
        ? `https://vidsrc.to/embed/tv/${id}/${s}/${e}`
        : `https://vidsrc.to/embed/movie/${id}`,
  },
  {
    id: "multiembed",
    name: "Server 2: MultiEmbed (Alternative)",
    tag: "Multi-Source",
    isEmbed: true,
    getUrl: (id, type, s, e) =>
      type === "tv"
        ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`
        : `https://multiembed.mov/?video_id=${id}&tmdb=1`,
  },
  {
    id: "vidsrc-me",
    name: "Server 3: VidSrc.me (Backup)",
    tag: "Backup",
    isEmbed: true,
    getUrl: (id, type, s, e) =>
      type === "tv"
        ? `https://vidsrc.me/embed/tv?tmdb=${id}&sea=${s}&epi=${e}`
        : `https://vidsrc.me/embed/movie?tmdb=${id}`,
  },
  {
    id: "official",
    name: "Server 4: Official Cinema Stream",
    tag: "Official • 0 Ads",
    isEmbed: false,
  },
  {
    id: "custom",
    name: "Server 5: Custom Direct Video Stream",
    tag: "MP4 / URL",
    isCustom: true,
  },
];

const AUDIO_TRACKS = [
  { id: "en-5.1", label: "English [Original] 5.1 Atmos" },
  { id: "hi-5.1", label: "Hindi 5.1 Surround" },
  { id: "es-5.1", label: "Spanish 5.1" },
  { id: "fr-5.1", label: "French 5.1" },
  { id: "ja-5.1", label: "Japanese [Original]" },
];

const SUBTITLE_TRACKS = [
  { id: "off", label: "Off" },
  { id: "en-cc", label: "English [CC]" },
  { id: "es", label: "Spanish" },
  { id: "fr", label: "French" },
  { id: "de", label: "German" },
];

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5];

function Watch() {
  const { id, type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const seasonParam = Number(searchParams.get("season")) || 1;
  const episodeParam = Number(searchParams.get("episode")) || 1;

  const [selectedServer, setSelectedServer] = useState("vidsrc"); // default to full movie/series server!
  const [media, setMedia] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [episodesList, setEpisodesList] = useState([]);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState("en-5.1");
  const [selectedSubtitle, setSelectedSubtitle] = useState("en-cc");
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [progressPercent, setProgressPercent] = useState(15);
  const [nextEpisodeCountdown, setNextEpisodeCountdown] = useState(null);
  const [customVideoUrl, setCustomVideoUrl] = useState(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  );
  const [inputUrl, setInputUrl] = useState("");

  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const watchContainerRef = useRef(null);

  // Fetch media & video
  useEffect(() => {
    async function loadMediaAndVideo() {
      try {
        const [mediaRes, videosRes] = await Promise.all([
          api.get(`/${type}/${id}?api_key=${API_KEY}`),
          api.get(`/${type}/${id}/videos?api_key=${API_KEY}`),
        ]);

        setMedia(mediaRes.data);

        const vids = videosRes.data?.results || [];
        const trailer =
          vids.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
          vids.find((v) => v.site === "YouTube") ||
          null;

        if (trailer) {
          setVideoKey(trailer.key);
        } else {
          setVideoKey("dQw4w9WgXcQ");
        }

        if (type === "tv") {
          const sRes = await api.get(`/tv/${id}/season/${seasonParam}?api_key=${API_KEY}`).catch(() => null);
          if (sRes?.data?.episodes) {
            setEpisodesList(sRes.data.episodes);
          }
        }

        saveProgress(
          {
            ...mediaRes.data,
            media_type: type,
            currentSeason: seasonParam,
            currentEpisode: episodeParam,
          },
          Math.floor(Math.random() * 40) + 20
        );

        const introTimer = setTimeout(() => setShowSkipIntro(true), 3500);
        const hideIntroTimer = setTimeout(() => setShowSkipIntro(false), 24000);

        return () => {
          clearTimeout(introTimer);
          clearTimeout(hideIntroTimer);
        };
      } catch (err) {
        console.error("Failed to load video", err);
        showToast("Error loading stream", "error");
      }
    }

    loadMediaAndVideo();
  }, [id, type, seasonParam]);

  // Handle controls auto-hide
  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (!showAudioModal && !showSpeedMenu && !showEpisodeDrawer && !showServerMenu) {
        setShowControls(false);
      }
    }, 4500);
  };

  useEffect(() => {
    const handleMouseMove = () => resetControlsTimer();
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [showAudioModal, showSpeedMenu, showEpisodeDrawer, showServerMenu]);

  const handlePlayerReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume);
    playerRef.current.playVideo();
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const seekRelative = (seconds) => {
    if (!playerRef.current) return;
    const current = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(current + seconds, true);
    showToast(`${seconds > 0 ? "+10s" : "-10s"}`, "info");
  };

  const skipIntro = () => {
    if (!playerRef.current) return;
    const current = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(current + 85, true);
    setShowSkipIntro(false);
    showToast("Skipped Intro", "info");
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (playerRef.current) {
      playerRef.current.setVolume(val);
      if (val === 0) {
        playerRef.current.mute();
        setIsMuted(true);
      } else if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
    if (playerRef.current?.setPlaybackRate) {
      playerRef.current.setPlaybackRate(speed);
    }
    showToast(`Speed set to ${speed}x`, "info");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      watchContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const switchServer = (serverId) => {
    setSelectedServer(serverId);
    setShowServerMenu(false);
    const s = SERVERS.find((x) => x.id === serverId);
    showToast(`Switched to ${s.name}`, "success");
  };

  const triggerNextEpisodePrompt = () => {
    const nextEpNum = episodeParam + 1;
    const nextEp = episodesList.find((e) => e.episode_number === nextEpNum);
    if (nextEp) {
      setNextEpisodeCountdown(nextEp);
    } else {
      showToast("You've reached the last episode of this season!", "info");
    }
  };

  const playNextEpisodeImmediately = (epNum) => {
    setNextEpisodeCountdown(null);
    setSearchParams({ season: seasonParam, episode: epNum });
    showToast(`Playing Episode ${epNum}`, "success");
  };

  const selectEpisode = (epNum) => {
    setSearchParams({ season: seasonParam, episode: epNum });
    setShowEpisodeDrawer(false);
    showToast(`Playing Episode ${epNum}`, "success");
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setCustomVideoUrl(inputUrl.trim());
      showToast("Loaded custom stream URL", "success");
    }
  };

  const titleText = media?.title || media?.name || "Streaming Media";
  const currentEpData = episodesList.find((e) => e.episode_number === episodeParam);
  const activeServerObj = SERVERS.find((s) => s.id === selectedServer) || SERVERS[0];

  return (
    <div className="ott_watch_container" ref={watchContainerRef}>
      {/* Video Stream Rendering based on active Server */}
      <div className="ott_video_wrapper">
        {/* Case 1: Third-party Embed Full Movie Server (VidSrc / MultiEmbed) */}
        {activeServerObj.isEmbed && (
          <iframe
            src={activeServerObj.getUrl(id, type, seasonParam, episodeParam)}
            title="Movie Stream Player"
            className="ott_embed_iframe"
            allowFullScreen
            referrerPolicy="origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}

        {/* Case 2: Custom MP4 Video Stream */}
        {activeServerObj.isCustom && (
          <div className="custom_video_player_box">
            <video
              src={customVideoUrl}
              controls
              autoPlay
              className="custom_html5_video"
            />
            <form className="custom_url_bar" onSubmit={handleApplyCustomUrl}>
              <input
                type="url"
                placeholder="Paste direct .mp4 or stream video URL here..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
              <button type="submit">Load Stream</button>
            </form>
          </div>
        )}

        {/* Case 3: Official TMDB HD Preview Stream */}
        {selectedServer === "official" && (
          <>
            {videoKey ? (
              <YouTube
                videoId={videoKey}
                onReady={handlePlayerReady}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    disablekb: 1,
                  },
                }}
                className="youtube_player_frame"
              />
            ) : (
              <div className="video_loading_box">
                <div className="ott_spinner" />
                <p>Loading cinema stream...</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Skip Intro Button (for Official Server) */}
      {selectedServer === "official" && showSkipIntro && (
        <button className="ott_skip_intro_btn" onClick={skipIntro}>
          <FastForward size={18} /> Skip Intro
        </button>
      )}

      {/* Next Episode Countdown Overlay Card */}
      {nextEpisodeCountdown && (
        <div className="next_episode_countdown_card">
          <div className="countdown_badge">UP NEXT</div>
          <div className="countdown_body">
            <img
              src={
                nextEpisodeCountdown.still_path
                  ? `https://image.tmdb.org/t/p/w300${nextEpisodeCountdown.still_path}`
                  : `https://image.tmdb.org/t/p/w300${media?.backdrop_path}`
              }
              alt={nextEpisodeCountdown.name}
              className="next_ep_thumb"
            />
            <div>
              <p className="next_ep_tag">Episode {nextEpisodeCountdown.episode_number}</p>
              <h4>{nextEpisodeCountdown.name}</h4>
            </div>
          </div>
          <div className="countdown_actions">
            <button
              className="btn_play_next"
              onClick={() => playNextEpisodeImmediately(nextEpisodeCountdown.episode_number)}
            >
              <Play size={16} fill="black" /> Play Now
            </button>
            <button
              className="btn_cancel_countdown"
              onClick={() => setNextEpisodeCountdown(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Overlays / HUD Controls (Always visible top bar for switching servers & navigating) */}
      <div className={`ott_player_hud ${showControls ? "visible" : "hidden"}`}>
        {/* Top Bar with Server Switcher */}
        <div className="hud_top_bar">
          <button className="hud_back_btn" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowLeft size={28} />
          </button>
          <div className="hud_title_box">
            <h2>{titleText}</h2>
            {type === "tv" && (
              <span className="hud_episode_tag">
                S{seasonParam}:E{episodeParam} {currentEpData?.name ? `• ${currentEpData.name}` : ""}
              </span>
            )}
          </div>

          {/* Server Switcher Dropdown in Top Bar */}
          <div className="player_server_switcher_box">
            <button
              className="server_trigger_btn"
              onClick={() => setShowServerMenu(!showServerMenu)}
            >
              <Server size={17} />
              <span>{activeServerObj.name.split(":")[0]}</span>
              <span className="server_active_pill">{activeServerObj.tag}</span>
              <ChevronDown size={15} />
            </button>

            {showServerMenu && (
              <div className="server_dropdown_menu">
                <div className="server_menu_header">
                  <h4>Select Streaming Server</h4>
                  <p>If a stream is slow or buffering, switch servers below.</p>
                </div>
                {SERVERS.map((srv) => (
                  <div
                    key={srv.id}
                    className={`server_menu_item ${selectedServer === srv.id ? "active" : ""}`}
                    onClick={() => switchServer(srv.id)}
                  >
                    <div className="server_item_info">
                      <p className="srv_name">{srv.name}</p>
                      <span className="srv_tag">{srv.tag}</span>
                    </div>
                    {selectedServer === srv.id && <Check size={16} className="srv_check" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar Controls (Only shown for Official server, since embed servers provide their own HUD) */}
        {selectedServer === "official" && (
          <div className="hud_bottom_bar">
            {/* Scrubber Progress Bar */}
            <div className="hud_scrubber_track">
              <div className="hud_scrubber_progress" style={{ width: `${progressPercent}%` }}>
                <div className="hud_scrubber_thumb" />
              </div>
            </div>

            <div className="hud_controls_row">
              <div className="controls_left">
                <button className="hud_ctrl_btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? <Pause size={26} /> : <Play size={26} fill="currentColor" />}
                </button>

                <button className="hud_ctrl_btn" onClick={() => seekRelative(-10)} title="Rewind 10s">
                  <RotateCcw size={22} />
                  <span className="ctrl_badge">10</span>
                </button>

                <button className="hud_ctrl_btn" onClick={() => seekRelative(10)} title="Forward 10s">
                  <RotateCw size={22} />
                  <span className="ctrl_badge">10</span>
                </button>

                {type === "tv" && (
                  <button
                    className="hud_ctrl_btn"
                    onClick={triggerNextEpisodePrompt}
                    title="Next Episode"
                  >
                    <SkipForward size={22} />
                  </button>
                )}

                {/* Volume Slider */}
                <div className="volume_control_box">
                  <button className="hud_ctrl_btn" onClick={toggleMute}>
                    {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume_slider"
                  />
                </div>
              </div>

              <div className="controls_right">
                {/* Episodes Drawer button */}
                {type === "tv" && episodesList.length > 0 && (
                  <button
                    className="hud_ctrl_btn with_text"
                    onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
                    title="Episodes Guide"
                  >
                    <ListVideo size={18} />
                    <span>Episodes</span>
                  </button>
                )}

                {/* Audio & Subtitles Menu */}
                <div className="player_dropdown_anchor">
                  <button
                    className="hud_ctrl_btn with_text"
                    onClick={() => setShowAudioModal(!showAudioModal)}
                    title="Audio & Subtitles"
                  >
                    <MessageSquare size={18} />
                    <span>Audio & Subtitles</span>
                  </button>

                  {showAudioModal && (
                    <div className="player_audio_modal">
                      <div className="audio_modal_column">
                        <h4>Audio</h4>
                        {AUDIO_TRACKS.map((track) => (
                          <div
                            key={track.id}
                            className={`audio_modal_item ${selectedAudio === track.id ? "selected" : ""}`}
                            onClick={() => {
                              setSelectedAudio(track.id);
                              showToast(`Audio set to ${track.label}`, "info");
                            }}
                          >
                            {selectedAudio === track.id && <Check size={14} />}
                            <span>{track.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="audio_modal_column">
                        <h4>Subtitles</h4>
                        {SUBTITLE_TRACKS.map((track) => (
                          <div
                            key={track.id}
                            className={`audio_modal_item ${selectedSubtitle === track.id ? "selected" : ""}`}
                            onClick={() => {
                              setSelectedSubtitle(track.id);
                              showToast(`Subtitles set to ${track.label}`, "info");
                            }}
                          >
                            {selectedSubtitle === track.id && <Check size={14} />}
                            <span>{track.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Speed Selector */}
                <div className="player_dropdown_anchor">
                  <button
                    className="hud_ctrl_btn with_text"
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    title="Playback Speed"
                  >
                    <Gauge size={18} />
                    <span>{playbackSpeed}x</span>
                  </button>

                  {showSpeedMenu && (
                    <div className="player_speed_menu">
                      {SPEED_OPTIONS.map((speed) => (
                        <div
                          key={speed}
                          className={`speed_item ${playbackSpeed === speed ? "selected" : ""}`}
                          onClick={() => changeSpeed(speed)}
                        >
                          {playbackSpeed === speed && <Check size={14} />}
                          <span>{speed === 1 ? "1x (Normal)" : `${speed}x`}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <span className="hud_hd_badge">4K ULTRA HD</span>

                <button className="hud_ctrl_btn" onClick={toggleFullscreen} title="Fullscreen">
                  {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top right quick helper for external servers */}
        {activeServerObj.isEmbed && (
          <div className="embed_quick_bar">
            {type === "tv" && (
              <button
                className="hud_ctrl_btn with_text"
                onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
              >
                <ListVideo size={18} />
                <span>Season {seasonParam} Episodes</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Episode Switcher Drawer */}
      {showEpisodeDrawer && type === "tv" && (
        <div className="player_episodes_drawer">
          <div className="drawer_header">
            <h3>Season {seasonParam} Episodes</h3>
            <button className="drawer_close" onClick={() => setShowEpisodeDrawer(false)}>✕</button>
          </div>
          <div className="drawer_episodes_list">
            {episodesList.map((ep) => (
              <div
                key={ep.id}
                className={`drawer_ep_item ${ep.episode_number === episodeParam ? "current" : ""}`}
                onClick={() => selectEpisode(ep.episode_number)}
              >
                <span className="ep_index">{ep.episode_number}</span>
                <img
                  src={
                    ep.still_path
                      ? `https://image.tmdb.org/t/p/w200${ep.still_path}`
                      : `https://image.tmdb.org/t/p/w200${media?.backdrop_path}`
                  }
                  alt={ep.name}
                  className="drawer_ep_img"
                />
                <div className="drawer_ep_text">
                  <p className="drawer_ep_name">{ep.name}</p>
                  <p className="drawer_ep_runtime">{ep.runtime ? `${ep.runtime}m` : "45m"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Watch;
