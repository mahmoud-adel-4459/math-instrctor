import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Maximize, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface VideoPlayerProps {
  source: string; // Embed or HTML5 video link
  poster?: string;
  initialProgressSeconds?: number;
  onProgress?: (watchedSeconds: number, duration: number) => void;
  onComplete?: () => void;
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  source,
  poster,
  initialProgressSeconds = 0,
  onProgress,
  onComplete,
  title,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isIframe] = useState(() => source.includes('embed') || source.includes('youtube') || source.includes('vimeo'));

  useEffect(() => {
    if (videoRef.current && initialProgressSeconds > 0 && !isIframe) {
      videoRef.current.currentTime = initialProgressSeconds;
    }
  }, [initialProgressSeconds, isIframe]);

  const togglePlay = () => {
    if (!videoRef.current || isIframe) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(curr);
    setDuration(dur);
    const pct = (curr / dur) * 100;
    setProgress(pct);

    if (onProgress) {
      onProgress(Math.floor(curr), Math.floor(dur));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onComplete) onComplete();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const targetTime = (parseFloat(e.target.value) / 100) * duration;
    videoRef.current.currentTime = targetTime;
    setProgress(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeSpeed = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full glass-panel rounded-3xl overflow-hidden border border-blue-900/40 bg-black group select-none shadow-2xl"
    >
      {isIframe ? (
        <iframe
          src={source}
          title={title || 'فيديو الدرس'}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <video
            ref={videoRef}
            src={source}
            poster={poster}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Controls Bar Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-4 opacity-90 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
            {/* Seek Bar */}
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-700/60 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all"
            />

            <div className="flex items-center justify-between text-xs text-slate-200">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 text-slate-300 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="font-mono dir-ltr">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Playback speed selector */}
                <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg px-2 py-1">
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  {[1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => changeSpeed(s)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        playbackSpeed === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1.5 text-slate-300 hover:text-white"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
