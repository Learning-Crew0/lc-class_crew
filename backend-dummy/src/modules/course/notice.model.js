const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
    {
        courseId: {type: mongoose.Schema.Types.ObjectId, ref:"Course", required: true},
        noticeImage: {type: String},
        noticeDesc: {type: String},
    }, {timestamps: true}
);

module.exports = mongoose.model("Notice", noticeSchema);