const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        password: { type: String, required: true },
        category: {
            type: String,
            enum: ["restaurant", "grocery", "pharmacy", "other"],
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: {
                type: String,
                default: "Egypt",
            },
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        contact: {
            phone: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                trim: true,
                lowercase: true,
            },
        },
        images: [
            {
                type: String,
            },
        ],
        rating: {
            totalRatings: { type: Number, default: 0 },
            averageRating: { type: Number, default: 0 },
        },
        menu: [
            {
                name: String,
                price: Number,
                image: String,
                category: [String],
                available: { type: Boolean, default: true },
            },
        ],
        isOpen: {
            type: Boolean,
            default: true,
        },
        workingHours: {
            open: String,
            close: String,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);
