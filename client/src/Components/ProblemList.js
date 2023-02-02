import React, { useEffect, useState } from "react";
import Problem from "./Problem";
import { Helpers } from "../Helper";

export default function ProblemList() {
    // Set states
    const [problemData, setProblemData] = useState(null);

    useEffect(() => {
        async function fetchProblemData() {
            try {
                // Use fetch to send GET request to the /problemList
                const res = await fetch("/problemList", {
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

                // Set problemData state to returned data
                setProblemData(data.data);

                // Check that user token hasn't expired
                Helpers.checkTokenExpired(data);
            } catch (error) {
                // Log any errors that occured
                console.error(error);
            }
        }

        // Call fetchProblemData function
        fetchProblemData();
    }, []);

    // Create array of problems to show on leaderboard by mapping over problemData
    // and populating data in the  Problem component
    let problems;
    if (problemData) {
        problems = problemData.map((problem) => (
            <Problem
                id={problem._id}
                name={problem.name}
                description={problem.description}
                key={problem._id}
            />
        ));
    }

    return (
        <div className="problem-list-container">
            <h1 className="title-text">Problem List</h1>
            {problems ? problems : <p>No problems available.</p>}
        </div>
    );
}
