import React, { useEffect, useState } from "react";

export default function LeaderboardRecord(userRecord) {
    // Set states
    const [localDateTime, setLocalDateTime] = useState(null);

    useEffect(() => {
        // Convert date time for earliest correct submission to a user friendly format
        const date = new Date(userRecord.earliestCorSub);
        const options = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        };

        const localDateString = date.toLocaleDateString("en-US", options);

        // Set localDateTime to new user friendly format
        setLocalDateTime(localDateString);
    }, []);

    return (
        <div className="leaderboard-user-container">
            <div>
                <p>
                    {userRecord.fname} {userRecord.lname}
                </p>
            </div>
            <div>
                <p>{localDateTime}</p>
            </div>
            <div>
                <p>{userRecord.attempts}</p>
            </div>
        </div>
    );
}
