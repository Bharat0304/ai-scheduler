import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import signin1 from "../Component/Assets/signin1.png";
import { getApiUrl } from "../config";

export const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const login = async () => {
    try {
      const response = await fetch(getApiUrl('api/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('auth-token', data.token);
        window.location.replace("/homepage");
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Could not connect to server. Please try again later.");
    }
  };

  const signup = async () => {
    try {
      const response = await fetch(getApiUrl('api/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('auth-token', data.token);
        window.location.replace("/OnboardingPage");
      } else {
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError("Could not connect to server. Please try again later.");
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <div className="loginsignup-left">
          <img src={signin1} alt="signin" />
        </div>
        <div className="loginsignup-right">
          <h1>{state}</h1>
          <div className="loginsignup-fields">
            {state === "Sign Up" ? 
              <input 
                type="text" 
                placeholder='Name' 
                name="username"
                value={formData.username}
                onChange={changeHandler}
              /> : null}
            <input 
              type="email" 
              placeholder='Email' 
              name="email"
              value={formData.email}
              onChange={changeHandler}
            />
            <input 
              type="password" 
              placeholder='Password'
              name="password"
              value={formData.password}
              onChange={changeHandler}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button 
            onClick={() => state === "Login" ? login() : signup()}
            className="continue-button"
          >
            Continue
          </button>
          <p className="loginsignup-login">
            {state === "Sign Up" 
              ? "Already have an account? "
              : "Don't have an account? "}
            <span 
              onClick={() => setState(state === "Login" ? "Sign Up" : "Login")}
            >
              {state === "Sign Up" ? "Login here" : "Sign up here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
