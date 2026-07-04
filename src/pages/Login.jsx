import React, {
  useState,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  useEffect(() => {
    if (
      localStorage.getItem(
        "isLoggedIn"
      )
    ) {
      navigate("/home");
    }
  }, [navigate]);

  const handleStart = () => {
  if (!email.trim()) {
    alert(
      "Please enter your email"
    );
    return;
  }

  localStorage.setItem(
    "isLoggedIn",
    "true"
  );

  localStorage.setItem(
    "userEmail",
    email
  );

  navigate("/home");
};

  return (
    <div className="login_page">
      <div className="login_overlay">
        <div className="login_content">
          <h1>MOVIES HUB</h1>

          <h2>
            Unlimited Movies, TV
            Shows & Entertainment
          </h2>

          <p>
            Watch Trending Movies &
            Series Anytime.
          </p>

          <div className="email_box">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <button
              onClick={
                handleStart
              }
            >
              Get Started →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;