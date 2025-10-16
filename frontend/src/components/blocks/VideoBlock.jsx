import React from 'react';

const VideoBlock = ({ url }) => (
    <div className="my-6 p-4 bg-gray-100 rounded-xl shadow-inner flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-3 text-blue-600">Video Resource</h3>
        <p className="text-gray-600 italic">Search query: "{url}"</p>
        <div className="w-full max-w-lg h-64 bg-gray-300 rounded-lg flex items-center justify-center mt-3">
            <p className="text-gray-500">Video Placeholder: Search for "{url}"</p>
        </div>
        <p className="text-xs mt-2 text-gray-400">Note: External video embedding requires a dedicated search and embed logic.</p>
    </div>
);

export default VideoBlock;
