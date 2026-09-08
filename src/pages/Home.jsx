import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Row from "../components/Row";
import MediaModal from "../components/MediaModal";
import ProfileSelect from "../components/ProfileSelect";
import Footer from "../components/Footer";
import ToastContainer from "../components/Toast";
import requests from "../services/requests";
import {
  getContinueWatching,
  hasSelectedProfileThisSession,
  getActiveProfile,
} from "../services/storage";

function Home() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [continueWatchingList, setContinueWatchingList] = useState([]);
  const [showProfileSelect, setShowProfileSelect] = useState(!hasSelectedProfileThisSession());
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

  // If user has not chosen profile yet this session, display Who's Watching screen
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

      <div className="ott_rows_container">
        {/* Continue Watching for Active User */}
        {continueWatchingList.length > 0 && (
          <Row
            title={`Continue Watching for ${currentProfile.name}`}
            customItems={continueWatchingList}
            isBackdrop={true}
            onOpenModal={setSelectedMedia}
          />
        )}

        {/* Top 10 Movies Today */}
        <Row
          title="Top 10 Movies in Your Country Today"
          fetchUrl={requests.fetchTrendingMovies}
          isTop10={true}
          onOpenModal={setSelectedMedia}
        />

        {/* Top 10 TV Shows */}
        <Row
          title="Top 10 TV Shows Today"
          fetchUrl={requests.fetchTrendingTV}
          isTop10={true}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Trending Now"
          fetchUrl={requests.fetchTrending}
          isLarge={true}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Top Rated Masterpieces"
          fetchUrl={requests.fetchTopRated}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Action & High-Octane Thrills"
          fetchUrl={requests.fetchActionMovies}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Binge-Worthy TV Dramas"
          fetchUrl={requests.fetchDramaTV}
          isBackdrop={true}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Sci-Fi & Futuristic Worlds"
          fetchUrl={requests.fetchSciFiMovies}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Laugh-Out-Loud Comedies"
          fetchUrl={requests.fetchComedyMovies}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Chilling Horrors & Thrillers"
          fetchUrl={requests.fetchHorrorMovies}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Heartfelt Romances"
          fetchUrl={requests.fetchRomanceMovies}
          onOpenModal={setSelectedMedia}
        />

        <Row
          title="Captivating Documentaries"
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