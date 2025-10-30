const mongoose = require("mongoose");

const partnershipSchema = new mongoose.Schema(
    {
       proposerName: {type: String, required: true},
       proposerEmail: {type: String, required: true},
       message: {type: String, required: true},
       status: {type: String, enum: ["pending", "approved", "rejected"], default: "pending"},
    },{timestamps: true}
);

module.exports = mongoose.model("Partnership", partnershipSchema);