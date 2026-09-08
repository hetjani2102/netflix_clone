import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Row from "../components/Row";
import MediaModal from "../components/MediaModal";
import Footer from "../components/Footer";
import ToastContainer from "../components/Toast";
import requests from "../services/requests";

function Popular() {
  const [selectedMedia, setSelectedMedia] = useState(null);

  return (
    <div className="ott_popular_page">
      <Navbar />
      <ToastContainer />

      <div className="popular_page_header">
        <h1>New & Popular</h1>
        <p>Explore what everyone is watching right now, plus upcoming releases worth waiting for.</p>
      </div>

      <div className="ott_rows_container">
        <Row
          title="Top 10 Movies This Week"
          fetchUrl={requests.fetchTrendingMovies}
          isTop10={true}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Top 10 TV Shows This Week"
          fetchUrl={requests.fetchTrendingTV}
          isTop10={true}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Worth the Wait (Upcoming Blockbusters)"
          fetchUrl={requests.fetchUpcoming}
          isLarge={true}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Popular On The Air Series"
          fetchUrl={requests.fetchOnTheAirTV}
          isBackdrop={true}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Global Top Rated"
          fetchUrl={requests.fetchTopRated}
          onOpenModal={setSelectedMedia}
        />
      </div>

      {selectedMedia && (
        <MediaModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onSelectMedia={(item) => setSelectedMedia(item)}
        />
      )}

      <Footer />
    </div>
  );
}

export default Popular;
