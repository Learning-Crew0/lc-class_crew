const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema(
    {
        courseId: {type: mongoose.Schema.Types.ObjectId, ref:"Course", required: true},
        name: {type: String, required: true},
        bio: {type: String},
        professionalField: {type: String},
        certificate: {type: String},
        attendanceHistory: [{type: String}],
    },{timestamps: true}
);

module.exports = mongoose.model("Instructor", instructorSchema);