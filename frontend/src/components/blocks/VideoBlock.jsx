import React, { useState } from "react";
import { Play, AlertCircle } from "lucide-react";
import "./VideoBlock.css";

const VideoBlock = ({ query = "", url = "" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use direct URL if provided, otherwise use query for search
  const videoUrl = url || (query ? `https://www.youtube.com/embed/?search_query=${encodeURIComponent(query)}` : null);

  if (!videoUrl) {
    return (
      <div className="video-block-error">
        <AlertCircle size={24} />
        <p>No video available for this lesson</p>
      </div>
    );
  }

  return (
    <div className="video-block-container">
      <div className="video-wrapper">
        <div className="video-placeholder">
          {isLoading && (
            <div className="video-loading">
              <div className="spinner"></div>
              <p>Loading video...</p>
            </div>
          )}
          <iframe
            className={`video-iframe ${!isLoading ? "loaded" : ""}`}
            src={videoUrl}
            title="Lesson Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError("Failed to load video");
            }}
          />
        </div>
        {error && (
          <div className="video-error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoBlock;

