const mongoose = require("mongoose");

// Define userdetails schema
const UserDetailsSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: true,
        },
        lname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        userType: {
            type: String,
            required: true,
        },
        solutions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Solution",
            },
        ],
    },
    {
        collection: "UserDetails",
    }
);

mongoose.model("UserDetails", UserDetailsSchema);
