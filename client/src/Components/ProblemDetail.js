import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helpers } from "../Helper";

export default function ProblemDetail() {
    // Set states
    const [problemData, setProblemData] = useState(null);
    const [answer, setAnswer] = useState("");
    const [correctAns, setCorrectAns] = useState(null);
    const [incorrectAns, setIncorrectAns] = useState(null);
    const [disableInputBox, setDisableInputBox] = useState(true);
    const [answerBoxPlaceholder, setAnswerBoxPlaceholder] = useState("");
    const [previouslyCompleted, setPreviouslyCompleted] = useState(null);

    // Get userId and problemId paramater using useParams Hook
    let { userId, problemId } = useParams();

    useEffect(() => {
        async function fetchProblemData() {
            try {
                // Use fetch to send GET request to the /leaderboard/*userId*/*problemId* endpoint
                const res = await fetch(`/problemList/${userId}/${problemId}`, {
                    method: "GET",
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

                // Check if user has previosuly completed quesion, set to true or false
                setPreviouslyCompleted(data.userCompleted);
                // Set problem data
                setProblemData(data.data);
                // Set dissableTextBox to true or false, dependant on whether the user has already answered questions
                setDisableInputBox(data.userCompleted);
                // Set text for the input placeholder, if already completed then placeholder will be set to correct solution
                setAnswerBoxPlaceholder(data.userCompleted ? data.data.solution : "Answer");
            } catch (error) {
                // Log any errors that occured
                console.error(error);
            }
        }

        // Call fetchProblemData function
        fetchProblemData();
    }, []);

    // Handle submit for submitting a solution
    async function handleSubmit(e) {
        // Prevent default behaviour of form submit event
        e.preventDefault();

        try {
            // Use fetch to send POST request to the /submitAnswer endpoint
            const res = await fetch("/submitAnswer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    problemId,
                    answer,
                    userId: window.localStorage.getItem("userId"),
                }),
            });

            // Get json data from the response
            const data = await res.json();

            // Check that user token hasn't expired
            Helpers.checkTokenExpired(data);

            // Set answer and incorrect answer states, these are booleans and will be set
            // when the user attempts to answer a problem
            setCorrectAns(data.correctAnswer);
            setIncorrectAns(!data.correctAnswer);

            // Disable input if answer correct
            setDisableInputBox(data.correctAnswer);
        } catch (error) {
            // Log any errors that occured
            console.error(error);
        }
    }

    // Default the input to being disabled
    let ansInput = (
        <input
            type="number"
            className="form-control"
            placeholder={answerBoxPlaceholder}
            onChange={(e) => setAnswer(e.target.value)}
            required
            disabled
        />
    );

    // If user has not submitted a correct answer before, disableInputBox will be false
    // and the input will not be disabled
    if (!disableInputBox) {
        ansInput = (
            <input
                type="number"
                className="form-control"
                placeholder={answerBoxPlaceholder}
                onChange={(e) => setAnswer(e.target.value)}
                required
            />
        );
    }

    // If user has already completed problem, message will show saying this.
    // If user hasn't already completed problem, it will move on to the following checks
    // If user has correctly aswered question since loading page, it will show a 'well done
    // message. If user has incorrectly answered problem since loading page, it will show
    // 'incorrect' message. Otherwise it will show nothing, such as when page is first loaded
    // and user hasn't previosuly answered the problem
    let ansDisplay;
    ansDisplay = previouslyCompleted ? (
        <p>You've already completed this question!</p>
    ) : correctAns ? (
        <p>Well done! You've completed the question.</p>
    ) : incorrectAns ? (
        <p>Incorrect! Try again.</p>
    ) : (
        <></>
    );

    return problemData ? (
        <div className="problem-detail-container">
            <h1 className="title-text">{problemData.name}</h1>
            <p>{problemData.description}</p>
            <form onSubmit={handleSubmit}>
                {ansInput}
                <div>
                    <button type="submit" className="button-one">
                        Submit Answer
                    </button>
                </div>
            </form>
            {ansDisplay}
        </div>
    ) : (
        <p>Loading...</p>
    );
}
