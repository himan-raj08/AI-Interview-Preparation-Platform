
import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import useAuth from "../hooks/useauth";

const Register = () => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { loading, handleregister } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await handleregister({
                userName,
                email,
                password
            });

            navigate("/");
        } catch (error) {
            console.log(
                "Register failed:",
                error.response?.data || error.message
            );
        }
    };

    if (loading) {
        return (
            <main>
                <h1>Loading..........</h1>
            </main>
        );
    }

    return (
        <div className="form-container">
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>

                {/* Username Field */}
                <div className="input-group">
                    <label htmlFor="userName">
                        UserName
                    </label>

                    <input
                        onChange={(e) =>
                            setUserName(e.target.value)
                        }
                        type="text"
                        id="userName"
                        name="userName"
                        value={userName}
                        placeholder="Enter Username"
                        required
                    />
                </div>

                {/* Email Field */}
                <div className="input-group">
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        placeholder="Enter Email address"
                        required
                    />
                </div>

                {/* Password Field */}
                <div className="input-group">
                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        placeholder="Enter Password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="button primary-button"
                    disabled={loading}
                >
                    Register
                </button>
            </form>

            <p className="text-center mt-4 text-gray-300">
                Already have an account?{" "}

                <Link
                    to="/login"
                    className="text-yellow-400 font-semibold hover:text-yellow-300"
                >
                    Login
                </Link>
            </p>
        </div>
    );
};

export default Register;

