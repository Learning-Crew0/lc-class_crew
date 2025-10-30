const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
    {
        courseId: {type: mongoose.Schema.Types.ObjectId, ref:"Course", required: true},
        images: [{type: String}],
        description: {type: String},
    }, {timestamps: true}
);

module.exports = mongoose.model("Promotion", promotionSchema);