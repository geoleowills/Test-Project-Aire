import React from "react";
import { Link } from "react-router-dom";

export default function UserHome({ userData }) {
    // Define logout function and clear local storage
    function logOut() {
        window.localStorage.clear();
        window.location.href = "./sign-in";
    }

    return (
        <div className="user-detail-container">
            <h1>Welcome!</h1>
            <h3>
                Name: {userData.fname} {userData.lname}
            </h3>
            <h3>Email: {userData.email}</h3>
            <Link className="button-one" to="/problemList">
                See Problem List
            </Link>
            <button onClick={logOut} className="button-one">
                Log Out
            </button>
        </div>
    );
}
