import React from "react";
import "./Styles/App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import UserDetails from "./Components/UserDetails";
import CreateProblem from "./Components/CreateProblem";
import PrivateRoute from "./Components/PrivateRoute";
import Header from "./Components/Header";
import ProblemList from "./Components/ProblemList";
import ProblemDetail from "./Components/ProblemDetail";
import Leaderboard from "./Components/Leaderboard";

function App() {
    const isLoggedIn = window.localStorage.getItem("loggedIn");
    return (
        <Router>
            <div className="App">
                <Header />
                <div className="main-wrapper">
                    <Routes>
                        <Route
                            exact
                            path="/"
                            element={isLoggedIn == "true" ? <UserDetails /> : <Login />}
                        />
                        <Route path="/sign-in" element={<Login />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/userDetails" element={<UserDetails />} />
                        <Route path="/problemList" element={<ProblemList />} exact />
                        <Route path="/problemList/:userId/:problemId" element={<ProblemDetail />} />
                        <Route path="/leaderboard/:id" element={<Leaderboard />} />
                        <Route element={<PrivateRoute />}>
                            <Route element={<CreateProblem />} path="/createProblem" exact />
                        </Route>
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
