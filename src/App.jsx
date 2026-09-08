import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Watchlist from "./pages/Watchlist";
import MovieDetails from "./pages/MovieDetails";
import Watch from "./pages/Watch";
import BrowseCategory from "./pages/BrowseCategory";
import Popular from "./pages/Popular";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/" element={<Login />} />

        {/* Protected OTT Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tv"
          element={
            <ProtectedRoute>
              <BrowseCategory type="tv" pageTitle="TV Shows" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <BrowseCategory type="movie" pageTitle="Movies" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/popular"
          element={
            <ProtectedRoute>
              <Popular />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/movie/:id/:type"
          element={
            <ProtectedRoute>
              <MovieDetails />
            </ProtectedRoute>
          }
        />

        {/* Video Player Route */}
        <Route
          path="/watch/:id/:type"
          element={
            <ProtectedRoute>
              <Watch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/watch/:id"
          element={
            <ProtectedRoute>
              <Watch />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;