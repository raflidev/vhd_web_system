"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveformPlayerProps {
  url?: string;
  file?: File;
  height?: number;
  waveColor?: string;
  progressColor?: string;
  className?: string;
  minPxPerSec?: number;
  onReady?: () => void;
}

export default function WaveformPlayer({
  url,
  file,
  height = 50,
  waveColor = "#cbd5e1",
  progressColor = "#ef4444",
  className = "",
  minPxPerSec = 1,
  onReady,
}: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!containerRef.current) return;

    // Create WaveSurfer instance
    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: waveColor,
      progressColor: progressColor,
      cursorColor: "transparent",
      barWidth: 2,
      barGap: 3,
      height: height,
      normalize: true,
      minPxPerSec: minPxPerSec,
    });

    // Load audio
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      wavesurfer.current.load(audioUrl);
    } else if (url) {
      wavesurfer.current.load(url);
    }

    // Events
    wavesurfer.current.on("ready", () => {
      setIsReady(true);
      setDuration(wavesurfer.current?.getDuration() || 0);
      if (onReady) onReady();
    });

    wavesurfer.current.on("audioprocess", (time) => {
      setCurrentTime(time);
    });

    wavesurfer.current.on("finish", () => {
      setIsPlaying(false);
    });

    wavesurfer.current.on("play", () => setIsPlaying(true));
    wavesurfer.current.on("pause", () => setIsPlaying(false));

    // Cleanup
    return () => {
      try {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }
      } catch (e) {
        console.warn("Error destroying wavesurfer instance:", e);
      }
    };
  }, [url, file, height, waveColor, progressColor, minPxPerSec]);

  // Handle play/pause
  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start if in draggable container
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button
        onClick={handlePlayPause}
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isPlaying ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        disabled={!isReady}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div ref={containerRef} className="w-full" />
      </div>

      <div className="text-xs font-medium text-gray-500 tabular-nums w-12 text-right flex-shrink-0">
        {formatTime(isPlaying ? currentTime : duration)}
      </div>
    </div>
  );
}
