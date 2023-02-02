const mongoose = require("mongoose");

// Define solution schema
const SolutionSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserDetails",
            required: true,
        },
        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true,
        },
        solution: {
            type: String,
            required: true,
        },
        correct: {
            type: Boolean,
            required: true,
        },
        submissionDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        collection: "Solution",
    }
);

mongoose.model("Solution", SolutionSchema);
