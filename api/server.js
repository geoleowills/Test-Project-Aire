const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Set Json Web Token
const JWT_SECRET =
    "p3s5v8y/B?E(H+MbQeThWmZ4t7w9z$C&F)J@NcRfUjXn2r5u8x/A?D*G-KaPdSgVkYp3s6v9y$B&E)H+MbQeThWmZq4t7w!z%C*F-JaNcRfUjXn2r5u8x/A?D(G+KbPe";

// Set Mongo URI for connect
const MONGO_URI =
    "mongodb+srv://georgewillens:airetestprojectpassword@airetestproject.nvltn9x.mongodb.net/?retryWrites=true&w=majority";

// Create express app
const app = express();

// Set up iddlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error(err));

// Require Models
require("./Models/UserDetails");
require("./Models/Problem");
require("./Models/Solution");

// Set model variables
const User = mongoose.model("UserDetails");
const Problem = mongoose.model("Problem");
const Solution = mongoose.model("Solution");

// Create a new user, users cannot sign up again with the same email
app.post("/register", async (req, res) => {
    try {
        const { fname, lname, email, password, userType } = req.body;

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Check that user doesn't already exist
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(400).json({ error: "User already exists with this email" });
        }

        // Create new user
        const newUser = await User.create({
            fname,
            lname,
            email,
            password: encryptedPassword,
            userType,
        });

        res.status(201).json({ status: "ok", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Log in user
app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User Not found" });
        }

        // Authenticate and log user in
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ email: user.email }, JWT_SECRET, {
                expiresIn: "24h",
            });

            return res.status(200).json({ status: "ok", data: token, user });
        }
        return res.status(401).json({ error: "Invalid Password" });
    } catch (error) {
        return res.status(500).json({ error: "An internal error occurred" });
    }
});

// Return user data for requested user
app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET);
        const useremail = user.email;

        // Find user
        const data = await User.findOne({ email: useremail });
        if (!data) {
            return res.status(404).send({ status: "error", data: "User not found" });
        }

        return res.status(200).send({ status: "ok", data });
    } catch (error) {
        return res.status(401).send({ status: "error", data: "Token expired" });
    }
});

// Create a new problem, all three fields are required
app.post("/createProblem", async (req, res) => {
    try {
        const { name, description, solution } = req.body;

        // Check problem doesn't already exist
        const oldProblem = await Problem.findOne({ name });
        if (oldProblem) {
            return res.status(400).json({ error: "Problem already exists" });
        }

        // Create new problem
        const newProblem = await Problem.create({
            name,
            description,
            solution,
        });

        res.status(201).json({ status: "ok", problem: newProblem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Returns all problems in the collection
app.get("/problemList", async (req, res) => {
    try {
        // Find all problems in collection
        const data = await Problem.find();
        res.status(200).json({ status: "ok", data });
    } catch (error) {
        res.status(500).json({ status: "error", error });
    }
});

// Returns the details for a specific problem, if the user has already
// correctly answered the querstion, the solutions will also be returned.
// Otherwise the solution won't be included.
app.get("/problemList/:userId/:problemId", async (req, res) => {
    let { userId, problemId } = req.params;

    try {
        // Check if current user has submitted a correct solution for problem
        const solution = await Solution.findOne({
            owner: ObjectId(userId),
            correct: true,
            problem: ObjectId(problemId),
        });
        const userCompleted = solution !== null;

        // Find problem details, if user has not anwered the question correctly yet, don't include solution
        const problem = await Problem.findOne({ _id: problemId }).select(
            userCompleted ? {} : { solution: 0 }
        );

        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }

        return res.status(200).json({ status: "ok", data: problem, userCompleted });
    } catch (error) {
        return res.status(500).json({ status: "error", error });
    }
});

// Submit a solution, you will receive a response telling you if your solution was correct
app.post("/submitAnswer", async (req, res) => {
    const { problemId, answer, userId } = req.body;

    try {
        // Find problem
        const problem = await Problem.findOne({ _id: problemId });

        if (!problem) {
            return res.status(400).json({ error: "Problem Not found" });
        }

        // Check if answer is correct, the input will only ever contain number as this is
        // all the input field allows
        const ansCorrect = answer.toString().trim() === problem.solution.toString().trim();

        // Create solution
        await Solution.create({
            owner: userId,
            problem: problem._id,
            solution: answer,
            correct: ansCorrect,
        });

        return res.status(201).json({ status: "ok", correctAnswer: ansCorrect });
    } catch (error) {
        return res.status(500).json({ status: "error", error });
    }
});

// Returns the data for the leaderboard for a specific problem, it is ordered by
// earliest correct submission, and then by number of attempts
app.get("/leaderboard/:id", async (req, res, next) => {
    let id = req.params.id;

    try {
        // Use the aggregate function to return the required data from the MongoDB
        // collections
        const data = await Solution.aggregate([
            {
                $match: {
                    problem: new ObjectId(id),
                },
            },
            {
                $group: {
                    _id: "$owner",
                    submissionCount: {
                        $sum: 1,
                    },
                    earliestCorrectSubmission: {
                        $min: {
                            $cond: [
                                "$correct",
                                "$submissionDate",
                                new Date("9999-12-31T23:59:59.999Z"),
                            ],
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "UserDetails",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    fname: "$user.fname",
                    lname: "$user.lname",
                    email: "$user.email",
                    submissionCount: 1,
                    earliestCorrectSubmission: 1,
                    _id: 0,
                },
            },
            {
                $sort: {
                    earliestCorrectSubmission: 1,
                    submissionCount: 1,
                },
            },
        ]);

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error });
    }
});

// Start listening on port 5000
app.listen(5000, () => {
    console.log("Server Started");
});
