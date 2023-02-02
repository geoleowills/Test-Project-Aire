import React from "react";
import { Link } from "react-router-dom";

export default function Problem(problem) {
    // Get userId from local storage
    const userId = window.localStorage.getItem("userId");

    return (
        <div className="problem-container">
            <h3>{problem.name}</h3>
            <Link to={`/problemList/${userId}/${problem.id}`} key={problem._id}>
                Try Problem
            </Link>
            <Link to={`/leaderboard/${problem.id}`} key={problem._id}>
                Problem Leaderboard
            </Link>
        </div>
    );
}
