import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Compass, Sparkles, Film, ShieldAlert, Globe } from "lucide-react";

const HUBS = [
  {
    id: "action",
    title: "Action & Adventure",
    tagline: "High-Octane Thrills",
    icon: Zap,
    gradient: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)",
    glowColor: "rgba(249, 115, 22, 0.35)",
    path: "/movies",
    badge: "EXPLOSIVE",
  },
  {
    id: "scifi",
    title: "Sci-Fi & Cyberpunk",
    tagline: "Futuristic Realities",
    icon: Compass,
    gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    glowColor: "rgba(6, 182, 212, 0.35)",
    path: "/movies",
    badge: "4K CINEMA",
  },
  {
    id: "originals",
    title: "MoviesHub Originals",
    tagline: "Exclusive Masterpieces",
    icon: Sparkles,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    glowColor: "rgba(139, 92, 246, 0.4)",
    path: "/popular",
    badge: "PREMIERE",
  },
  {
    id: "animation",
    title: "Animation & Anime",
    tagline: "Epic Visual Worlds",
    icon: Film,
    gradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
    glowColor: "rgba(16, 185, 129, 0.35)",
    path: "/movies",
    badge: "FAMILY",
  },
  {
    id: "crime",
    title: "Crime & Thrillers",
    tagline: "Gripping Mysteries",
    icon: ShieldAlert,
    gradient: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
    glowColor: "rgba(99, 102, 241, 0.35)",
    path: "/tv",
    badge: "18+ NOIR",
  },
  {
    id: "docs",
    title: "Docuseries & Nature",
    tagline: "Real Untold Stories",
    icon: Globe,
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    glowColor: "rgba(14, 165, 233, 0.35)",
    path: "/movies",
    badge: "REALITY",
  },
];

function CategoryHubs() {
  const navigate = useNavigate();

  return (
    <section className="category_hubs_section">
      <div className="category_hubs_header">
        <h3 className="category_hubs_heading">Explore Channels & Hubs</h3>
        <span className="category_hubs_sub">Curated universe of cinema collections</span>
      </div>

      <div className="category_hubs_grid">
        {HUBS.map((hub) => {
          const IconComponent = hub.icon;
          return (
            <div
              key={hub.id}
              className="category_hub_tile"
              style={{ "--hub-gradient": hub.gradient, "--hub-glow": hub.glowColor }}
              onClick={() => navigate(hub.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(hub.path)}
            >
              <div className="hub_tile_ambient_glow" />
              <div className="hub_tile_content">
                <div className="hub_icon_bubble">
                  <IconComponent size={22} className="hub_icon" />
                </div>
                <div className="hub_info">
                  <span className="hub_badge">{hub.badge}</span>
                  <h4 className="hub_title">{hub.title}</h4>
                  <p className="hub_tagline">{hub.tagline}</p>
                </div>
              </div>
              <div className="hub_border_shine" />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryHubs;
