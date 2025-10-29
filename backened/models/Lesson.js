// backend/models/Lesson.js - FIXED MODEL

const mongoose = require("mongoose");

// Content block schema - flexible to support all block types
const contentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["heading", "paragraph", "code", "video", "mcq"],
      required: true,
    },
    // Heading fields
    text: {
      type: String,
      default: "",
    },
    level: {
      type: Number,
      default: 1,
    },
    // Paragraph fields
    // (uses 'text' field above)

    // Code block fields
    language: {
      type: String,
      default: "javascript",
    },
    code: {
      type: String,
      default: "",
    },

    // Video block fields
    query: {
      type: String,
      default: "",
    },
    videoId: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },

    // MCQ block fields
    question: {
      type: String,
      default: "",
    },
    options: {
      type: [String],
      default: [],
    },
    answer: {
      type: Number,
      default: 0,
    },
    explanation: {
      type: String,
      default: "",
    },
  },
  { _id: false } // Don't create separate IDs for content blocks
);

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    objectives: {
      type: [String],
      default: [],
    },
    // 🔧 FIXED: Make sure content is properly defined
    content: {
      type: [contentBlockSchema],
      default: [],
      required: false,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isEnriched: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 Debug: Log when lesson is saved
lessonSchema.pre("save", function (next) {
  console.log("💾 Lesson being saved:", {
    title: this.title,
    contentBlocksCount: this.content?.length || 0,
    objectives: this.objectives?.length || 0,
  });

  if (this.content && this.content.length > 0) {
    console.log("📊 Content blocks breakdown:");
    this.content.forEach((block, idx) => {
      if (block.type === "mcq") {
        console.log(
          `  Block ${idx} (MCQ): question="${
            block.question?.substring(0, 30) || "(empty)"
          }..."`
        );
      } else if (block.type === "code") {
        console.log(`  Block ${idx} (CODE): ${block.code?.length || 0} chars`);
      } else {
        console.log(`  Block ${idx} (${block.type}): OK`);
      }
    });
  }

  next();
});

// 🔍 Debug: Log when lesson is found
lessonSchema.post("findOne", function (doc) {
  if (doc) {
    console.log("📖 Lesson loaded from DB:", {
      title: doc.title,
      contentBlocksCount: doc.content?.length || 0,
    });
  }
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
