import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  Loader,
  AlertCircle,
  ChevronDown,
  Download,
  Pause,
  Play,
} from "lucide-react";
import "./HinglishTranslator.css";

const HinglishTranslator = ({ lesson = {} }) => {
  const [expanded, setExpanded] = useState(false);
  const [hinglishText, setHinglishText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);
  const [audioAvailable, setAudioAvailable] = useState(false);

  // 🔧 FIX: Reset translator state when lesson changes
  useEffect(() => {
    console.log("📝 Lesson changed, resetting Hinglish translator");
    setExpanded(false);
    setHinglishText(null);
    setError(null);
    setAudioAvailable(false);
    setAudioPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, [lesson?._id]); // Reset whenever lesson ID changes

  // Extract text from lesson content - 🔧 FIX: Include ALL paragraphs and headings
  const extractLessonText = () => {
    if (!lesson || !Array.isArray(lesson.content)) {
      console.warn("No lesson content available");
      return "";
    }

    // Extract ALL paragraph and heading blocks (not just first 2)
    const textContent = lesson.content
      .filter((block) => ["paragraph", "heading"].includes(block.type))
      .map((block) => block.text || block.title || "")
      .filter((text) => text.trim().length > 0); // Remove empty strings

    console.log(`📚 Extracted ${textContent.length} text blocks from lesson`);

    // Join all text without substring limit to preserve all content
    const fullText = textContent.join("\n\n");
    
    console.log(
      `📏 Total text length: ${fullText.length} characters (${textContent.length} blocks)`
    );

    return fullText;
  };

  const handleTranslateToHinglish = async () => {
    try {
      setLoading(true);
      setError(null);
      setHinglishText(null);
      setAudioAvailable(false);

      const text = extractLessonText();
      if (!text) {
        setError("No lesson content available to translate");
        console.warn("No text extracted for translation");
        return;
      }

      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api";

      console.log("🌐 Translating to Hinglish...");
      console.log(`   Lesson: ${lesson.title}`);
      console.log(`   Text length: ${text.length} characters`);

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
        console.log(
          `✅ Hinglish translation completed (${data.data.hinglishText.length} characters)`
        );
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

      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api";

      console.log("🎙️  Generating audio from Hinglish text...");

      const response = await fetch(
        `${API_URL}/enrichment/generate-hinglish-audio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: hinglishText,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Get audio blob
      const audioBlob = await response.blob();
      console.log(`✅ Audio generated (${audioBlob.size} bytes)`);

      // Create object URL for audio
      const audioUrl = URL.createObjectURL(audioBlob);

      // Set audio source
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setAudioPlaying(true);
        setAudioAvailable(true);
      }

      console.log("🎵 Audio playing...");
    } catch (err) {
      console.error("❌ Audio generation error:", err);
      setError(err.message || "Failed to generate audio");
      setAudioAvailable(false);
    } finally {
      setAudioLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
        setAudioPlaying(false);
      } else {
        audioRef.current.play();
        setAudioPlaying(true);
      }
    }
  };

  const handleDownloadAudio = async () => {
    try {
      if (!hinglishText) {
        setError("Please translate to Hinglish first");
        return;
      }

      setAudioLoading(true);
      setError(null);

      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api";

      console.log("📥 Downloading audio...");

      const response = await fetch(
        `${API_URL}/enrichment/generate-hinglish-audio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: hinglishText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate audio for download");
      }

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
      setError(err.message || "Failed to download audio");
    } finally {
      setAudioLoading(false);
    }
  };

  const handleAudioEnded = () => {
    setAudioPlaying(false);
  };

  return (
    <div className="hinglish-translator-container">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPlay={() => setAudioPlaying(true)}
        onPause={() => setAudioPlaying(false)}
      />

      {/* Toggle Button */}
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

      {/* Expanded Content */}
      {expanded && (
        <div className="hinglish-content">
          {/* Translate Button */}
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

          {/* Error Message */}
          {error && (
            <div className="hinglish-error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Hinglish Text Box */}
          {hinglishText && (
            <div className="hinglish-text-box">
              <h4 className="hinglish-text-title">📝 Hinglish Explanation:</h4>
              <div className="hinglish-text-content">
                {hinglishText.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              {/* Audio Controls */}
              <div className="hinglish-audio-controls">
                <button
                  onClick={handleGenerateAudio}
                  disabled={audioLoading}
                  className={`hinglish-audio-button ${
                    audioAvailable ? "active" : ""
                  }`}
                  title={audioAvailable ? "Generate audio" : "Generate audio"}
                >
                  {audioLoading ? (
                    <>
                      <Loader size={16} className="icon-spin" />
                      <span>Generating...</span>
                    </>
                  ) : audioAvailable ? (
                    <>
                      {audioPlaying ? (
                        <>
                          <Pause size={16} />
                          <span>Pause Audio</span>
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          <span>Play Audio</span>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Volume2 size={16} />
                      <span>Generate Audio</span>
                    </>
                  )}
                </button>

                {/* Play/Pause Button (shown when audio is available) */}
                {audioAvailable && (
                  <button
                    onClick={handlePlayPause}
                    disabled={audioLoading}
                    className="hinglish-audio-button play-pause-btn"
                    title={audioPlaying ? "Pause" : "Play"}
                  >
                    {audioPlaying ? (
                      <>
                        <Pause size={16} />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        <span>Play</span>
                      </>
                    )}
                  </button>
                )}

                {/* Download Button */}
                <button
                  onClick={handleDownloadAudio}
                  disabled={audioLoading}
                  className="hinglish-audio-button download-btn"
                  title="Download audio as MP3"
                >
                  <Download size={16} />
                  <span>Download MP3</span>
                </button>
              </div>

              {/* New Translation Button */}
              <button
                onClick={() => {
                  setHinglishText(null);
                  setAudioAvailable(false);
                  setAudioPlaying(false);
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.src = "";
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