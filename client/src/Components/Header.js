import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    // Check if user is already logged in
    const loggedIn = window.localStorage.getItem("loggedIn") == "true";

    // Define log out function and clear local storage
    const logOut = () => {
        window.localStorage.clear();
        window.location.href = "/sign-in";
    };

    return (
        <div className="header">
            <Link to="/userDetails" className="title-container">
                <h1 className="title-text">Solve Problems</h1>
            </Link>

            <div className="nav-container">
                <nav className="nav-main">
                    {loggedIn ? (
                        <div onClick={logOut}>
                            <p className="header-link">Log Out</p>
                        </div>
                    ) : (
                        <div>
                            <Link className="header-link" to="/sign-up">
                                Sign Up
                            </Link>
                            <Link className="header-link" to="/sign-in">
                                Sign In
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </div>
    );
}
