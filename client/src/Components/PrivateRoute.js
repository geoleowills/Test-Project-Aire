import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
    // Check if user is admin
    const isAdmin = JSON.parse(window.localStorage.getItem("isAdmin")) || false;

    // If user is admin, allow to requested route, otherwrise redirect to /sign-in
    return isAdmin ? <Outlet /> : <Navigate to={{ pathname: "/sign-in" }} />;
}
