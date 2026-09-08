import React, { useState } from "react";
import { Plus, Pencil, Check, Shield } from "lucide-react";
import { getProfiles, saveProfiles, setActiveProfile } from "../services/storage";
import { showToast } from "./Toast";

const AVATAR_OPTIONS = [
  "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
];

function ProfileSelect({ onProfileSelected }) {
  const [profiles, setProfiles] = useState(getProfiles());
  const [isManaging, setIsManaging] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editIsKids, setEditIsKids] = useState(false);

  const handleSelectProfile = (profile) => {
    if (isManaging) {
      // Open edit modal
      setEditingProfile(profile);
      setEditName(profile.name);
      setEditAvatar(profile.avatar);
      setEditIsKids(profile.isKids || false);
      return;
    }

    setActiveProfile(profile);
    showToast(`Welcome back, ${profile.name}!`, "success");
    if (onProfileSelected) {
      onProfileSelected(profile);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const updated = profiles.map((p) =>
      p.id === editingProfile.id
        ? { ...p, name: editName.trim(), avatar: editAvatar, isKids: editIsKids }
        : p
    );

    setProfiles(updated);
    saveProfiles(updated);
    setEditingProfile(null);
    showToast("Profile updated successfully", "success");
  };

  const handleAddProfile = () => {
    if (profiles.length >= 5) {
      showToast("Maximum 5 profiles reached", "info");
      return;
    }

    const newProfile = {
      id: `profile-${Date.now()}`,
      name: `User ${profiles.length + 1}`,
      avatar: AVATAR_OPTIONS[profiles.length % AVATAR_OPTIONS.length],
      isKids: false,
      plan: "Standard HD",
    };

    const updated = [...profiles, newProfile];
    setProfiles(updated);
    saveProfiles(updated);
    showToast(`Added profile "${newProfile.name}"`, "success");
  };

  return (
    <div className="who_is_watching_screen">
      <div className="who_is_watching_container">
        <h1 className="who_title">
          {isManaging ? "Manage Profiles:" : "Who's watching?"}
        </h1>

        <div className="profiles_grid">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`profile_item ${isManaging ? "managing" : ""}`}
              onClick={() => handleSelectProfile(profile)}
            >
              <div className="avatar_box">
                <img src={profile.avatar} alt={profile.name} className="profile_img" />
                {profile.isKids && <span className="kids_flag">KIDS</span>}
                {isManaging && (
                  <div className="pencil_overlay">
                    <Pencil size={28} className="pencil_icon" />
                  </div>
                )}
              </div>
              <span className="profile_name">{profile.name}</span>
            </div>
          ))}

          {profiles.length < 5 && (
            <div className="profile_item add_profile" onClick={handleAddProfile}>
              <div className="avatar_box add_box">
                <Plus size={44} className="plus_icon" />
              </div>
              <span className="profile_name">Add Profile</span>
            </div>
          )}
        </div>

        <button
          className={`manage_profiles_btn ${isManaging ? "done" : ""}`}
          onClick={() => setIsManaging(!isManaging)}
        >
          {isManaging ? "Done" : "Manage Profiles"}
        </button>
      </div>

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className="edit_profile_modal_backdrop" onClick={() => setEditingProfile(null)}>
          <div className="edit_profile_modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>

            <form onSubmit={handleSaveEdit}>
              <div className="edit_modal_body">
                <img src={editAvatar} alt="Profile" className="edit_current_avatar" />

                <div className="edit_form_fields">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Profile Name"
                    className="edit_name_input"
                    maxLength={15}
                    required
                  />

                  <label className="kids_checkbox_label">
                    <input
                      type="checkbox"
                      checked={editIsKids}
                      onChange={(e) => setEditIsKids(e.target.checked)}
                    />
                    <span>Kid? (Only age 12 and under titles)</span>
                  </label>
                </div>
              </div>

              <div className="edit_avatar_picker">
                <p>Choose an avatar icon:</p>
                <div className="edit_avatars_row">
                  {AVATAR_OPTIONS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Choice"
                      className={`edit_avatar_opt ${editAvatar === url ? "selected" : ""}`}
                      onClick={() => setEditAvatar(url)}
                    />
                  ))}
                </div>
              </div>

              <div className="edit_actions">
                <button type="submit" className="save_profile_btn">
                  <Check size={18} /> Save Changes
                </button>
                <button
                  type="button"
                  className="cancel_profile_btn"
                  onClick={() => setEditingProfile(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSelect;
