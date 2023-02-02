import React, { useEffect, useState } from "react";
import UserHome from "./UserHome";
import AdminHome from "./AdminHome";
import { Helpers } from "../Helper";

export default function UserDetails() {
    // Set states
    const [userData, setUserData] = useState("");
    const [admin, setAdmin] = useState(false);
    const loggedIn = window.localStorage.getItem("loggedIn");

    useEffect(() => {
        // Check if user logged in, if not, redirect to sign-in page
        if (!loggedIn) {
            window.location.href = "./sign-in";
            return false;
        }

        async function fetchUserData() {
            try {
                // Use fetch to send POST request to the /userData endpoint
                const res = await fetch("/userData", {
                    method: "POST",
                    crossDomain: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        token: window.localStorage.getItem("token"),
                    }),
                });

                // Get json data from the response
                const data = await res.json();

                // Check that user token hasn't expired
                Helpers.checkTokenExpired(data);

                // Check if user is admin, if they are, set admin to true
                if (data.data.userType == "Admin") {
                    setAdmin(true);
                }
                setUserData(data.data);
            } catch (error) {
                // log any errors that occured
                console.error(error);
                alert(error);
            }
        }

        // Call fetchUserData function
        fetchUserData();
    }, []);

    if (loggedIn) {
        return admin ? <AdminHome userData={userData} /> : <UserHome userData={userData} />;
    } else {
        return <h1 className="loading">Loading...</h1>;
    }
}
