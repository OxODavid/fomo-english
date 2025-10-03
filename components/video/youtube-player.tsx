"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubePlayerProps {
  videoUrl: string;
  title?: string;
  onVideoEnd?: () => void;
  onProgress?: (progress: number) => void;
}

export function YouTubePlayer({
  videoUrl,
  title,
  onVideoEnd,
  onProgress,
}: YouTubePlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0`
    : null;

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoaded(true);
    console.log("YouTube iframe loaded");
  };

  if (!embedUrl) {
    return (
      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Invalid YouTube URL</p>
          <p className="text-sm opacity-75">
            Please provide a valid YouTube video URL
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading video...</p>
          </div>
        </div>
      )}

      {/* YouTube iframe */}
      <iframe
        src={embedUrl}
        title={title || "YouTube video player"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
        onLoad={handleIframeLoad}
      />

      {/* Video title overlay */}
      {title && isLoaded && (
        <div className="absolute top-4 left-4 right-4">
          <h3 className="text-white text-lg font-medium bg-black bg-opacity-50 px-3 py-2 rounded backdrop-blur-sm">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
}
