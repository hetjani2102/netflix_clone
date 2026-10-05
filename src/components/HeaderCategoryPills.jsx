import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Zap, Compass, Sparkles, Film, ShieldAlert, Globe, Smile, Flame, Heart, Clapperboard } from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "All", path: "/home", icon: Clapperboard },
  { id: "action", name: "Action", path: "/movies?genre=28", icon: Zap },
  { id: "scifi", name: "Sci-Fi", path: "/movies?genre=878", icon: Compass },
  { id: "originals", name: "Originals", path: "/popular", icon: Sparkles },
  { id: "animation", name: "Animation", path: "/movies?genre=16", icon: Film },
  { id: "crime", name: "Crime & Thrillers", path: "/tv?genre=80", icon: ShieldAlert },
  { id: "docs", name: "Documentaries", path: "/movies?genre=99", icon: Globe },
  { id: "comedy", name: "Comedy", path: "/movies?genre=35", icon: Smile },
  { id: "horror", name: "Horror", path: "/movies?genre=27", icon: Flame },
  { id: "romance", name: "Romance", path: "/movies?genre=10749", icon: Heart },
];

function HeaderCategoryPills() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="header_category_bar">
      <div className="category_pills_track">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive =
            cat.id === "all"
              ? location.pathname === "/home" && !location.search
              : location.search.includes(`genre=`) || location.pathname === cat.path;

          return (
            <button
              key={cat.id}
              className={`category_header_pill ${isActive ? "active" : ""}`}
              onClick={() => navigate(cat.path)}
              type="button"
            >
              <Icon size={14} className="pill_icon" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default HeaderCategoryPills;
