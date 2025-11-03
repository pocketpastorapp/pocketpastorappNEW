
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  onPause: () => void;
  onPlay: () => void;
  onSeek: (time: number) => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
}

const AudioPlayer = ({
  isPlaying,
  duration,
  currentTime,
  onPause,
  onPlay,
  onSeek,
}: AudioPlayerProps) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (value: number[]) => {
    onSeek(value[0]);
  };

  return (
    <div className="p-4 bg-background border-t pointer-events-auto">
      <div className="flex items-center justify-between space-x-4 max-w-2xl mx-auto">
        {/* Play/Pause button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={isPlaying ? onPause : onPlay}
          className="h-10 w-10 rounded-full p-0 pointer-events-auto"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>

        {/* Progress slider and time display */}
        <div className="flex-1 flex items-center space-x-3 min-w-0">
          <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
            {formatTime(currentTime)}
          </span>
          
          <div className="flex-1 pointer-events-auto">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSliderChange}
              className="w-full"
            />
          </div>
          
          <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
