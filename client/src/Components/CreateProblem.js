import React, { useState } from "react";
import { Helpers } from "../Helper";

export default function CreateProblem() {
    // Set states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [solution, setSolution] = useState("");

    // Handle submit for problem creating
    async function handleSubmit(e) {
        // Prevent default behaviour of form submit event
        e.preventDefault();

        try {
            // Use fetch to send POST request to the /createProblem endpoint
            const res = await fetch("/createProblem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    description,
                    solution,
                }),
            });

            // Get json data from the response
            const data = await res.json();

            // Check that user token hasn't expired
            Helpers.checkTokenExpired(data);

            // Check if status ok
            if (data.status === "ok") {
                alert("Problem Created Successfully");
                console.log("Problem Created Successfully");
            } else {
                alert(data.error);
            }
        } catch (error) {
            // Log any errors that occurred
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>Create Problem</h3>
            <div className="input-main-container">
                <div className="input-inner-container">
                    <label htmlFor="problem-name">Problem Name</label>
                    <input
                        type="text"
                        id="problem-name"
                        className="form-control"
                        placeholder="Problem name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="input-inner-container">
                    <label htmlFor="problem-description">Problem Description</label>
                    <textarea
                        id="problem-description"
                        rows="8"
                        className="form-control"
                        placeholder="Problem description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="input-inner-container">
                    <label htmlFor="problem-solution">Solution</label>
                    <input
                        type="number"
                        id="problem-solution"
                        className="form-control"
                        placeholder="Solution"
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div>
                <button type="submit" className="button-one">
                    Create
                </button>
            </div>
        </form>
    );
}
