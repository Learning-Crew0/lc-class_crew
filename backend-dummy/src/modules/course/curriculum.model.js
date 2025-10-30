const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        content: {type: String},
    },{id: false}
);

const curriculumSchema = new mongoose.Schema(
    {
        courseId: {type: mongoose.Schema.Types.ObjectId, ref:"Course", required: true},
        keywords: [{type: String}],
        modules: [moduleSchema],
    }, {timestamps: true}
);

module.exports = mongoose.model("Curriculum", curriculumSchema);