"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { Slider } from "@/components/ui/slider";

// Example song data with src as placeholder URLs
const songs = [
  {
    id: 1,
    title: "Acoustic Breeze",
    artist: "Sunset Dreamer",
    src: "https://pixabay.com/music/upbeat-acoustic-breeze-110386/", // Replace with actual audio file path
  },
  {
    id: 2,
    title: "Gentle Stream",
    artist: "Nature Sounds",
    src: "https://pixabay.com/music/ambient-gentle-stream-133448/", // Replace with actual audio file path
  },
  {
    id: 3,
    title: "Midnight City Lights",
    artist: "Urban Beats",
    src: "https://pixabay.com/music/urban-lo-fi-city-night-143230/", // Replace with actual audio file path
  },
  {
    id: 4,
    title: "Forest Walk",
    artist: "Earth Tones",
    src: "https://pixabay.com/music/ambient-soft-piano-ambience-112982/", // Replace with actual audio file path
  },
  {
    id: 5,
    title: "Ocean Drive",
    artist: "Coastal Vibes",
    src: "https://pixabay.com/music/indie-pop-the-young-sea-129930/", // Replace with actual audio file path
  },
];

export default function Home() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Progress as a percentage
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = songs[currentSongIndex];

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
      setProgress(progressPercentage);
    }
  };

  const handleSeek = (value: number[]) => {
    const seekTime = (value[0] / 100) * (audioRef.current?.duration || 0);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setProgress(value[0]);
    }
  };

  useEffect(() => {
    // Reset progress when song changes
    setProgress(0);
    // Autoplay when song changes
    if (isPlaying) {
      audioRef.current?.play();
    }
  }, [currentSongIndex]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <h1 className="text-2xl font-bold mb-4">Offline Tunes</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">{currentSong.title}</h2>
        <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
      </div>

      <audio
        src={currentSong.src}
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="w-full max-w-md mb-4">
        <Slider
          defaultValue={[0]}
          max={100}
          step={0.1}
          onValueChange={(value) => handleSeek(value)}
          value={[progress]}
        />
      </div>

      <div className="flex items-center space-x-6">
        <button onClick={handlePrevious} className="text-secondary-foreground">
          <SkipBack className="h-6 w-6" />
        </button>
        <button
          onClick={handlePlayPause}
          className="text-secondary-foreground hover:text-accent"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8" />
          )}
        </button>
        <button onClick={handleNext} className="text-secondary-foreground">
          <SkipForward className="h-6 w-6" />
        </button>
      </div>

      <ul className="mt-8 w-full max-w-md">
        {songs.map((song, index) => (
          <li
            key={song.id}
            className={cn(
              "py-2 px-4 rounded-md hover:bg-accent/10 cursor-pointer",
              index === currentSongIndex ? "bg-accent/20" : ""
            )}
            onClick={() => setCurrentSongIndex(index)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{song.title}</p>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
