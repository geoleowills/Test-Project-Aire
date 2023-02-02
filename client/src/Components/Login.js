import React, { useState, useEffect } from "react";

export default function Login() {
    // Set states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // Check if user is already logged in, if they are, redirect to userDetails page
        if (window.localStorage.getItem("loggedIn") == "true") {
            window.location.href = "./userDetails";
        }
    }, []);

    // Handle submit for logging in
    async function handleSubmit(e) {
        // Prevent default behaviour of form submit event
        e.preventDefault();

        try {
            // Use fetch to send POST request to the /login-user endpoint
            const res = await fetch("/login-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            // Get json data from the response
            const data = await res.json();

            // Check if status ok
            if (data.status === "ok") {
                // Set local storage items
                window.localStorage.setItem("token", data.data);
                window.localStorage.setItem("loggedIn", true);
                window.localStorage.setItem("isAdmin", data.user.userType === "Admin");
                window.localStorage.setItem("userId", data.user._id);

                window.location.href = "./userDetails";
            }
        } catch (error) {
            alert("Login Unsuccessful");
            // Log any errors that occured
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>Sign In</h3>
            <div className="input-main-container">
                <div className="input-inner-container">
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-inner-container">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="input-inner-container remember-me">
                    <div className="custom-checkbox-container">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">
                            Remember me
                        </label>
                    </div>
                </div>
            </div>

            <div className="d-grid">
                <button className="button-one" type="submit">
                    Submit
                </button>
            </div>
            <div className="forgot-password text-right">
                <a className="login-signup" href="/sign-up">
                    Sign Up
                </a>
            </div>
        </form>
    );
}
