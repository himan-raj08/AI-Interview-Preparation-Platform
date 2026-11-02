
import React, { useState } from "react";
import "../auth.form.scss";
import { Link, useNavigate } from "react-router";
import useAuth from "../hooks/useauth.js"
import Home from "../../interview/pages/Home.jsx";

const Login = () => {
  const { loading, handlelogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handlelogin({ email, password });
    navigate("/");
  };

  if (loading) {
    return <div>Loading........</div>;
  }

  return (
    <div className="form-container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>

          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            id="email"
            name="email"
            placeholder="Enter Email address"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>

          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            id="password"
            name="password"
            placeholder="Enter Password"
          />
        </div>

        <button type="submit" className="button primary-button">
          Login
        </button>
      </form>

      <p>
        Create Account ? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;

