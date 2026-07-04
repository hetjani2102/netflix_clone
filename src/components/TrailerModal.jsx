import React from "react";
import YouTube from "react-youtube";

function TrailerModal({ trailerUrl, closeModal }) {
  const opts = {
    height: "500",
    width: "900",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="trailer_popup">
      <button
        className="close_btn"
        onClick={closeModal}
      >
        ✕
      </button>

      <YouTube
        videoId={trailerUrl}
        opts={opts}
      />
    </div>
  );
}

export default TrailerModal;