const mongoose = require("mongoose");

const deliveryAgentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true, lowercase: true },
    password: { type: String, required: true },
    vehicleType: { type: String, enum: ["motorcycle", "car", "bicycle"], required: true },
    vehicleNumber: {
        type: String,
        required: function () { return this.vehicleType !== "bicycle"; },
        unique: function () { return this.vehicleType !== "bicycle"; }
    },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: false, immutable: true },
    completedDeliveries: { type: Number, default: 0 },
    agentPhoto: { type: String }, // صورة المندوب
    vehiclePhoto: { type: String }, // صورة المركبة
    vehicleLicense: { type: String }, // رخصة المركبة
    driverLicense: { type: String }, // رخصة القيادة
}, { timestamps: true });

const DeliveryAgent = mongoose.model("DeliveryAgent", deliveryAgentSchema);
module.exports = DeliveryAgent;