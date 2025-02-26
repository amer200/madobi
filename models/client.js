const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String },
            country: { type: String, default: "Egypt" },
            coordinates: {
                lat: { type: Number },
                lng: { type: Number },
            },
        },
        orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
        ratings: {
            givenToRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
            givenToDrivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
        },
        walletBalance: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false },
        otpCode: { type: String },
        otpExpires: { type: Date },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;