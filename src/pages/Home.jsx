import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Row from "../components/Row";

import requests from "../services/requests";

function Home() {
  return (
    <>
      <Navbar />

      <Banner />

      <Row
        title="Trending Now"
        fetchUrl={
          requests.fetchTrending
        }
      />

      <Row
        title="Top Rated"
        fetchUrl={
          requests.fetchTopRated
        }
      />

      <Row
        title="Action Movies"
        fetchUrl={
          requests.fetchActionMovies
        }
      />

      <Row
        title="Comedy Movies"
        fetchUrl={
          requests.fetchComedyMovies
        }
      />

      <Row
        title="Horror Movies"
        fetchUrl={
          requests.fetchHorrorMovies
        }
      />

      <Row
        title="Romance Movies"
        fetchUrl={
          requests.fetchRomanceMovies
        }
      />

      <Row
        title="Documentaries"
        fetchUrl={
          requests.fetchDocumentaries
        }
      />
    </>
  );
}

export default Home;