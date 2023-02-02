const mongoose = require("mongoose");

// Define problem schema
const ProblemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        solution: {
            type: String,
            required: true,
        },
        submittedSolutions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Solution",
            },
        ],
    },
    {
        timestamps: true,
        collection: "Problem",
    }
);

mongoose.model("Problem", ProblemSchema);
