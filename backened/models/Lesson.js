const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: [mongoose.Schema.Types.Mixed], required: true }, // paragraphs, code, quiz, etc.
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
