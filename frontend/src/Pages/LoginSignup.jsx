import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import signin1 from "../Component/Assets/signin1.png";
import { getApiUrl } from "../config";
// import signin2 from "../Component/Assets/signin2.png";

const LoginSignup = () => {
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
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <div className="loginsignup-fields">
          {state === "Sign Up" ? <input type="text" placeholder="Your name" name="username" value={formData.username} onChange={changeHandler} /> : <></>}
          <input type="email" placeholder="Email address" name="email" value={formData.email} onChange={changeHandler} />
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={changeHandler} />
        </div>

        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>

        {state === "Login" ?
          <p className="loginsignup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>
          : <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p>}

        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
      <div className="loginsignup-right">
        <img className="signin-image frame8" src={signin1} alt="" />
      </div>
    </div>
  );
};

export default LoginSignup;
