import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    apps: {
        type: Array<string>,
        default: [],
    },
});

const userDb = mongoose.connection.useDb("API-Watchdog");

const Users = userDb.model("users", userSchema);

export default Users;
