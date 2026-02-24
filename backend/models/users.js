import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true ,trim: true, validate:{
        validator: function(v) {
            return /.+@.+\..+/.test(v);
        },
        message: props => `${props.value} is not a valid email!`

    }},
    password: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    profilePicture: {
        type: String,
        default: "default.jpg",
    },
    phone: {
        type: Number,
        required: true,
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpiry: {
        type: Date,
        default: null,
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpiry: {
        type: Date,
        default: null,
    },
});

const Users = new mongoose.model("users", userSchema);
export default Users;