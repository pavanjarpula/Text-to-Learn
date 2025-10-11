const mongoose = require("mongoose");

const contentBlockSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g., heading, paragraph, code, video, mcq
    // flexible payload: keep general fields
    text: String,
    language: String, // for code blocks
    url: String, // for video
    query: String, // for video query
    options: [String], // mcq options
    answer: mongoose.Schema.Types.Mixed, // index or string (allow mixed)
    explanation: String,
    // general free-form object to support new block types without schema changes
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    objectives: [{ type: String }],
    content: { type: [contentBlockSchema], required: true, default: [] }, // structured blocks
    isEnriched: { type: Boolean, default: false },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    order: { type: Number, default: 0 }, // ordering within module
  },
  { timestamps: true }
);

// After saving lesson, ensure module.lessons contains reference (if not present)
lessonSchema.post("save", async function (doc, next) {
  const Module = mongoose.model("Module");
  await Module.updateOne(
    { _id: doc.module },
    { $addToSet: { lessons: doc._id } }
  );
  next();
});

// When removing lesson, remove ref from module
lessonSchema.pre("remove", async function (next) {
  const Module = mongoose.model("Module");
  await Module.updateOne(
    { _id: this.module },
    { $pull: { lessons: this._id } }
  );
  next();
});

module.exports = mongoose.model("Lesson", lessonSchema);
