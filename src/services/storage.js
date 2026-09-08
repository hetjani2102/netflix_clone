// Storage helper for OTT features: Multi-Profiles, Continue Watching, Watchlist, Likes

const WATCHLIST_KEY = "movieshub_watchlist";
const CONTINUE_WATCHING_KEY = "movieshub_continue_watching";
const LIKED_KEY = "movieshub_liked";
const PROFILES_KEY = "movieshub_profiles";
const ACTIVE_PROFILE_KEY = "movieshub_active_profile";

const DEFAULT_PROFILES = [
  {
    id: "profile-1",
    name: "Alex",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
    isKids: false,
    plan: "Premium 4K HDR",
  },
  {
    id: "profile-2",
    name: "Kids",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    isKids: true,
    plan: "Kids Safe Mode",
  },
  {
    id: "profile-3",
    name: "Cinephile",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    isKids: false,
    plan: "Director's Cut",
  },
  {
    id: "profile-4",
    name: "Family",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    isKids: false,
    plan: "Shared Library",
  },
];

// Profile Management
export function getProfiles() {
  const saved = localStorage.getItem(PROFILES_KEY);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(DEFAULT_PROFILES));
  return DEFAULT_PROFILES;
}

export function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  window.dispatchEvent(new Event("profilesChanged"));
}

export function getActiveProfile() {
  const saved = localStorage.getItem(ACTIVE_PROFILE_KEY);
  if (saved) return JSON.parse(saved);
  const profiles = getProfiles();
  const first = profiles[0] || DEFAULT_PROFILES[0];
  localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(first));
  return first;
}

export function setActiveProfile(profile) {
  localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(profile));
  sessionStorage.setItem("profile_selected", "true");
  window.dispatchEvent(new Event("profileUpdated"));
}

export function hasSelectedProfileThisSession() {
  return sessionStorage.getItem("profile_selected") === "true";
}

export function resetProfileSession() {
  sessionStorage.removeItem("profile_selected");
  window.dispatchEvent(new Event("profileSessionReset"));
}

// Watchlist
export function getWatchlist() {
  const data = localStorage.getItem(WATCHLIST_KEY);
  return data ? JSON.parse(data) : [];
}

export function addToWatchlist(item) {
  const current = getWatchlist();
  if (!current.some((m) => m.id === item.id)) {
    const updated = [item, ...current];
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("watchlistUpdated"));
    return true;
  }
  return false;
}

export function removeFromWatchlist(id) {
  const current = getWatchlist();
  const updated = current.filter((m) => m.id !== id);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("watchlistUpdated"));
}

export function isInWatchlist(id) {
  const current = getWatchlist();
  return current.some((m) => m.id === id);
}

// Continue Watching
export function getContinueWatching() {
  const data = localStorage.getItem(CONTINUE_WATCHING_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveProgress(item, progressPercent = 35) {
  const list = getContinueWatching();
  const filtered = list.filter((m) => m.id !== item.id);
  const updated = [
    {
      ...item,
      progress: progressPercent,
      lastWatched: new Date().toISOString(),
    },
    ...filtered,
  ].slice(0, 15);
  localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("continueWatchingUpdated"));
}

export function removeFromContinueWatching(id) {
  const list = getContinueWatching();
  const updated = list.filter((m) => m.id !== id);
  localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("continueWatchingUpdated"));
}

// Liked items
export function getLikedItems() {
  const data = localStorage.getItem(LIKED_KEY);
  return data ? JSON.parse(data) : [];
}

export function toggleLike(id) {
  const liked = getLikedItems();
  let updated;
  if (liked.includes(id)) {
    updated = liked.filter((i) => i !== id);
  } else {
    updated = [...liked, id];
  }
  localStorage.setItem(LIKED_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("likesUpdated"));
  return updated.includes(id);
}

export function isLiked(id) {
  return getLikedItems().includes(id);
}

// Legacy profile compatibility
export function getUserProfile() {
  return getActiveProfile();
}

export function setUserProfile(profile) {
  setActiveProfile(profile);
}
