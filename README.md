# 🎬 MoviesHub Pro — Online Movie & TV Show Streaming Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-85c026?style=for-the-badge&logo=github)](https://hetjani2102.github.io/netflix_clone/dist/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TMDB API](https://img.shields.io/badge/TMDB-API-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)

**MoviesHub Pro** is a modern, responsive streaming web application inspired by classic platforms like 123Movies and top-tier OTT services. Built with **React** and **Vite**, it delivers an ultra-fast cinema browsing experience with live metadata from TMDB, multiple stream server fallbacks, interactive trailer previews, and episode drawers for TV series.

---

## 🚀 Live Demo

Experience the live app deployed on GitHub Pages:  
👉 **[Launch MoviesHub Pro](https://hetjani2102.github.io/netflix_clone/dist/)**

---

## ✨ Features

- 🎥 **Multi-Server Video Streaming:**
  - Integrated with multiple high-speed embed servers (*AutoEmbed, VidSrc Pro, 2Embed, VidSrc SU*) to ensure smooth playback and zero downtime.
  - Dedicated fallback to official cinema trailers for unreleased or upcoming titles.
- 📺 **Comprehensive TV Shows & Series Player:**
  - Season and episode picker drawer with episode titles, thumbnails, and runtimes.
  - Quick episode navigation without reloading the page.
- 🔍 **Real-Time Live Search:**
  - Instant debounced search querying TMDB's global catalog of movies and series.
- 🏷️ **123Movies-Style Poster Grid:**
  - Wrap-around poster layout with custom **HD** quality tags.
  - Centered quick-play hover action and clear movie metadata.
- 🍿 **Interactive Trailer Modals:**
  - Click on any title to open a detail modal with synopsis, cast, release info, and an auto-playing official YouTube trailer.
- 🔖 **Watchlist & Continue Watching:**
  - One-click bookmarking to save favorite movies and shows to a personal Watchlist.
  - Tracks playback progress in local storage with the ability to resume or remove items.
- 📱 **Mobile & Desktop Responsive:**
  - Seamless navigation across smartphones, tablets, and wide monitors.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | Frontend library for dynamic UI components |
| **Vite 5** | Lightning-fast development & production bundling |
| **React Router 7 (`HashRouter`)** | Client-side routing optimized for GitHub Pages |
| **Axios** | HTTP client for TMDB API data fetching |
| **Lucide React** | Clean, modern vector icon set |
| **React YouTube** | YouTube iframe integration for trailers |
| **TMDB API** | Movie and TV show database for live posters & details |

---

## 📂 Project Structure

```text
movieshub-pro-full-scaffold/
├── docs/                 # Production build for GitHub Pages hosting
├── dist/                 # Production build output
├── public/               # Public static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Banner.jsx          # Hero spotlight banner
│   │   ├── MovieCard.jsx       # 123Movies-styled poster cards
│   │   ├── Row.jsx             # Grid / category container
│   │   ├── MediaModal.jsx      # Detail & trailer preview modal
│   │   ├── Navbar.jsx          # Header navigation & search trigger
│   │   ├── Footer.jsx          # Platform footer
│   │   ├── ProtectedRoute.jsx  # Route guard for active sessions
│   │   └── Toast.jsx           # Notification toast alerts
│   ├── pages/            # Application views
│   │   ├── Home.jsx            # Main dashboard & trending feeds
│   │   ├── Watch.jsx           # Multi-server streaming video player
│   │   ├── Search.jsx          # Live search results page
│   │   ├── MovieDetails.jsx    # Full movie/show information page
│   │   ├── Watchlist.jsx       # Saved user bookmarks
│   │   ├── BrowseCategory.jsx  # Filter by genre & content type
│   │   ├── Popular.jsx         # Global top-chart charts
│   │   └── Login.jsx           # Obsidian cinema welcome screen
│   ├── services/         # API & Storage helpers
│   │   ├── api.js              # Axios instance configuration
│   │   ├── requests.js         # TMDB endpoints catalog
│   │   └── storage.js          # LocalStorage helper functions
│   ├── App.css           # Bespoke cinema stylesheet & color themes
│   ├── App.jsx           # Router configuration
│   └── main.jsx          # React DOM entry point
├── index.html            # Main HTML entry with GitHub Pages redirect
├── vite.config.js        # Vite build configuration with relative base
└── package.json          # Project dependencies & scripts
```

---

## 💻 Getting Started Locally

To run this project on your local machine:

### 1. Clone the repository
```bash
git clone https://github.com/hetjani2102/netflix_clone.git
cd netflix_clone
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:5173
```

### 4. Build for production
```bash
npm run build
```

---

## ⚠️ Disclaimer

This project is built strictly for **educational and portfolio purposes**. 
* All movie/TV show posters, titles, and metadata are provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).
* The application does not store or host any copyrighted video files on its servers. All streaming playback is embedded from external third-party public indexing providers.

---

## 👤 Author

- **Het Jani** — [GitHub Profile](https://github.com/hetjani2102)

⭐ If you like this project, please consider giving the repository a star!
