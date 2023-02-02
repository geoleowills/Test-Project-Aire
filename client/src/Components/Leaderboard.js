import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LeaderboardRecord from "./LeaderboardRecord";
import { Helpers } from "../Helper";

export default function Leaderboard() {
    // Set states
    const [leaderboardData, setLeaderboardData] = useState(null);

    // Get problem ID from URL
    let { id } = useParams();

    let leaderboard;

    useEffect(() => {
        async function fetchLeaderboardData() {
            try {
                // Use fetch to send GET request to the /leaderboard/*id* endpoint
                const res = await fetch(`/leaderboard/${id}`, {
                    method: "GET",
                    crossDomain: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                });

                // Get json data from response
                const data = await res.json();

                // Check that user token hasn't expired
                Helpers.checkTokenExpired(data);

                // Set leaderboard data to data in response
                setLeaderboardData(data);
            } catch (error) {
                // Log any errors that occured
                console.error(error);
            }
        }

        // Call fetchLeaderboardData function
        fetchLeaderboardData();
    }, []);

    // If leaderboardData contains data, create array of results
    if (leaderboardData) {
        leaderboard = leaderboardData.map((userRecord, index) => (
            <LeaderboardRecord
                fname={userRecord.fname}
                lname={userRecord.lname}
                earliestCorSub={userRecord.earliestCorrectSubmission}
                attempts={userRecord.submissionCount}
                key={index}
            />
        ));
    }

    return (
        <div className="leaderboard-container">
            <h1 className="title-text">Question Leaderboard</h1>
            <div className="leaderboard-subheader">
                <div>
                    <h3>Name</h3>
                </div>
                <div>
                    <h3>Earliest Correct Submission</h3>
                </div>
                <div>
                    <h3>No. of Attempts</h3>
                </div>
            </div>
            {leaderboard ? leaderboard : <p>No results available.</p>}
        </div>
    );
}
