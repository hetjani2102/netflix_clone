import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import HeaderCategoryPills from "../components/HeaderCategoryPills";
import Row from "../components/Row";
import MediaModal from "../components/MediaModal";
import ProfileSelect from "../components/ProfileSelect";
import Footer from "../components/Footer";
import ToastContainer from "../components/Toast";
import requests from "../services/requests";
import {
  getContinueWatching,
  getActiveProfile,
} from "../services/storage";

function Home() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [continueWatchingList, setContinueWatchingList] = useState([]);
  const [showProfileSelect, setShowProfileSelect] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(getActiveProfile());

  useEffect(() => {
    setContinueWatchingList(getContinueWatching());
    const handleUpdate = () => setContinueWatchingList(getContinueWatching());
    const handleProfileSessionReset = () => setShowProfileSelect(true);
    const handleProfileUpdated = () => setCurrentProfile(getActiveProfile());

    window.addEventListener("continueWatchingUpdated", handleUpdate);
    window.addEventListener("profileSessionReset", handleProfileSessionReset);
    window.addEventListener("profileUpdated", handleProfileUpdated);

    return () => {
      window.removeEventListener("continueWatchingUpdated", handleUpdate);
      window.removeEventListener("profileSessionReset", handleProfileSessionReset);
      window.removeEventListener("profileUpdated", handleProfileUpdated);
    };
  }, []);

  // If user explicitly triggers switch profile modal
  if (showProfileSelect) {
    return (
      <>
        <ToastContainer />
        <ProfileSelect onProfileSelected={() => setShowProfileSelect(false)} />
      </>
    );
  }

  return (
    <div className="ott_home_page">
      <Navbar onSwitchProfile={() => setShowProfileSelect(true)} />
      <ToastContainer />

      <Banner onOpenModal={setSelectedMedia} />

      {/* Sleek horizontal streaming category pills in header bar */}
      <HeaderCategoryPills />

      <div className="ott_rows_container">
        {/* Continue Watching for Active User */}
        {continueWatchingList.length > 0 && (
          <Row
            title="Continue Watching"
            customItems={continueWatchingList}
            isBackdrop={true}
            isContinueWatching={true}
            onOpenModal={setSelectedMedia}
          />
        )}

        {/* Global Chart-Toppers */}
        <Row
          title="Top 10 Movies Today"
          fetchUrl={requests.fetchTrendingMovies}
          isTop10={true}
          onOpenModal={setSelectedMedia}
        />

        {/* Top 10 TV Shows */}
        <Row
          title="Top 10 Series This Week"
          fetchUrl={requests.fetchTrendingTV}
          isTop10={true}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Premieres & Trending Now"
          fetchUrl={requests.fetchTrending}
          isLarge={true}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Critically Acclaimed Masterpieces"
          fetchUrl={requests.fetchTopRated}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Adrenaline & Action Blockbusters"
          fetchUrl={requests.fetchActionMovies}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Binge-Worthy Premium Dramas"
          fetchUrl={requests.fetchDramaTV}
          isBackdrop={true}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Sci-Fi & Cyberpunk Universes"
          fetchUrl={requests.fetchSciFiMovies}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Smart & Hilarious Comedies"
          fetchUrl={requests.fetchComedyMovies}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Chilling Horrors & Dark Thrillers"
          fetchUrl={requests.fetchHorrorMovies}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Deep Romances & Connections"
          fetchUrl={requests.fetchRomanceMovies}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Eye-Opening Docuseries"
          fetchUrl={requests.fetchDocumentaries}
          onOpenModal={setSelectedMedia}
        />
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <MediaModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onSelectMedia={(newMedia) => setSelectedMedia(newMedia)}
        />
      )}

      {/* Global OTT Footer */}
      <Footer />
    </div>
  );
}

export default Home;