const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        courseId: {type: mongoose.Schema.Types.ObjectId, ref:"Course", required: true},
        reviewerName: {type: String, required: true},
        avatar: {type: String},
        text: {type: String, required: true},
    }, {timestamps: true}
);

module.exports = mongoose.model("Review", reviewSchema);