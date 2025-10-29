import React, { useState } from "react";
import { Volume2, Loader, AlertCircle, ChevronDown, Download } from "lucide-react";
import "./HinglishTranslator.css";

const HinglishTranslator = ({ lesson = {} }) => {
  const [expanded, setExpanded] = useState(false);
  const [hinglishText, setHinglishText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  // Extract text from lesson content
  const extractLessonText = () => {
    if (!lesson || !Array.isArray(lesson.content)) return "";

    return lesson.content
      .filter((block) => ["paragraph", "heading"].includes(block.type))
      .map((block) => block.text || block.title || "")
      .join("\n\n")
      .substring(0, 2000);
  };

  const handleTranslateToHinglish = async () => {
    try {
      setLoading(true);
      setError(null);
      setHinglishText(null);

      const text = extractLessonText();
      if (!text) {
        setError("No lesson content available to translate");
        return;
      }

      // FIXED: Use process.env for CRA (not import.meta.env)
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

      console.log("🌐 Translating to Hinglish...");
      console.log(`📍 Using API URL: ${API_URL}`);

      const response = await fetch(`${API_URL}/enrichment/translate-hinglish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          lessonTitle: lesson.title,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setHinglishText(data.data.hinglishText);
        console.log("✅ Hinglish translation completed");
      } else {
        throw new Error(data.message || "Translation failed");
      }
    } catch (err) {
      console.error("❌ Translation error:", err);
      setError(err.message || "Failed to translate to Hinglish");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    try {
      setAudioLoading(true);
      setError(null);

      if (!hinglishText) {
        setError("Please translate to Hinglish first");
        return;
      }

      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

      console.log("🎙️ Generating audio...");

      const response = await fetch(`${API_URL}/enrichment/generate-audio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: hinglishText,
          language: "hi-IN",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      setAudioElement(audio);
      setAudioAvailable(true);

      audio.play();
      setAudioPlaying(true);

      audio.addEventListener("ended", () => {
        setAudioPlaying(false);
      });

      console.log("✅ Audio generated and playing");
    } catch (err) {
      console.error("❌ Audio generation error:", err);
      setError(err.message || "Failed to generate audio");
    } finally {
      setAudioLoading(false);
    }
  };

  const handleDownloadAudio = async () => {
    try {
      if (!hinglishText) {
        setError("Please translate to Hinglish first");
        return;
      }

      setAudioLoading(true);

      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${API_URL}/enrichment/generate-audio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: hinglishText,
          language: "hi-IN",
        }),
      });

      if (!response.ok) throw new Error("Failed to generate audio");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${lesson.title || "lesson"}-hinglish-audio.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("✅ Audio downloaded");
    } catch (err) {
      console.error("❌ Download error:", err);
      setError("Failed to download audio");
    } finally {
      setAudioLoading(false);
    }
  };

  return (
    <div className="hinglish-translator-container">
      <button
        onClick={() => setExpanded(!expanded)}
        className="hinglish-toggle-button"
        title="Expand Hinglish translation"
      >
        <div className="hinglish-toggle-content">
          <span className="hinglish-icon">🇮🇳 हिंग्लिश</span>
          <span className="hinglish-label">Hindi-English Explanation</span>
        </div>
        <ChevronDown
          size={20}
          className={`toggle-chevron ${expanded ? "expanded" : ""}`}
        />
      </button>

      {expanded && (
        <div className="hinglish-content">
          {!hinglishText && (
            <button
              onClick={handleTranslateToHinglish}
              disabled={loading}
              className="hinglish-action-button translate-btn"
            >
              {loading ? (
                <>
                  <Loader size={16} className="icon-spin" />
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <span>🌐</span>
                  <span>Translate to Hinglish</span>
                </>
              )}
            </button>
          )}

          {error && (
            <div className="hinglish-error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {hinglishText && (
            <div className="hinglish-text-box">
              <h4 className="hinglish-text-title">📝 Hinglish Explanation:</h4>
              <div className="hinglish-text-content">
                {hinglishText.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              <div className="hinglish-audio-controls">
                <button
                  onClick={handleGenerateAudio}
                  disabled={audioLoading}
                  className={`hinglish-audio-button ${
                    audioAvailable ? "active" : ""
                  }`}
                  title="Generate and play audio"
                >
                  {audioLoading ? (
                    <>
                      <Loader size={16} className="icon-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={16} />
                      <span>
                        {audioAvailable
                          ? audioPlaying
                            ? "Pause Audio"
                            : "Play Audio"
                          : "Generate Audio"}
                      </span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadAudio}
                  disabled={audioLoading}
                  className="hinglish-audio-button download-btn"
                  title="Download audio"
                >
                  <Download size={16} />
                  <span>Download MP3</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setHinglishText(null);
                  setAudioAvailable(false);
                  setAudioPlaying(false);
                  if (audioElement) {
                    audioElement.pause();
                  }
                }}
                className="hinglish-reset-button"
              >
                🔄 New Translation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HinglishTranslator;