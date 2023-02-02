import React, { Component, useState } from "react";

export default function SignUp() {
    // Set states
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("");
    const [secretKey, setSecretKey] = useState("");

    // Handle submit for problem creating
    async function handleSubmit(e) {
        // Prevent default behaviour of form submit event
        e.preventDefault();
        try {
            // Only allow user to sign up as admin if they know secretKey
            if (userType === "Admin" && secretKey !== "vwtiguan") {
                throw new Error("Invalid Admin");
            }

            // Use fetch to send POST request to the /register endpoint
            const res = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    fname,
                    email,
                    lname,
                    password,
                    userType,
                }),
            });

            // Get json data from the response
            const data = await res.json();

            // Check if status ok
            if (data.status === "ok") {
                alert("Registration Successful");
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error) {
            // Log any errors that occurred
            console.error(error);
            alert(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>Sign Up</h3>
            <div className="input-main-container">
                <div className="user-admin-container">
                    Register As
                    <input
                        type="radio"
                        name="UserType"
                        value="User"
                        onChange={(e) => setUserType(e.target.value)}
                    />
                    User
                    <input
                        type="radio"
                        name="UserType"
                        value="Admin"
                        onChange={(e) => setUserType(e.target.value)}
                    />
                    Admin
                </div>
                {userType == "Admin" ? (
                    <div className="input-inner-container">
                        <label>Secret Key</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Secret Key"
                            onChange={(e) => setSecretKey(e.target.value)}
                        />
                    </div>
                ) : null}

                <div className="input-inner-container">
                    <label>First name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        onChange={(e) => setFname(e.target.value)}
                    />
                </div>

                <div className="input-inner-container">
                    <label>Last name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Last name"
                        onChange={(e) => setLname(e.target.value)}
                    />
                </div>

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
            </div>

            <div>
                <button type="submit" className="button-one">
                    Sign Up
                </button>
            </div>
            <div>
                <a className="login-signup" href="/sign-in">
                    Sign In
                </a>
            </div>
        </form>
    );
}
