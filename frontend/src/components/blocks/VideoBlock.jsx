// src/components/blocks/VideoBlock.jsx
import React from "react";

/**
 * video block expects either:
 *  - { type: "video", url: "https://www.youtube.com/embed/..." }
 *  - or { type: "video", query: "search terms" } (then show placeholder or query text)
 *
 * For full YouTube lookup see Milestone 9 (backend proxy for YouTube API)
 */
const VideoBlock = ({ url, query }) => {
  if (url) {
    return (
      <div className="video-block my-4">
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            title="lesson-video"
            src={url}
            frameBorder="0"
            allowFullScreen
            className="w-full h-64"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="video-placeholder p-3 border rounded">
      <div className="font-semibold">Video</div>
      <div className="text-sm text-gray-600">{query || "Video query not provided"}</div>
    </div>
  );
};

export default VideoBlock;
