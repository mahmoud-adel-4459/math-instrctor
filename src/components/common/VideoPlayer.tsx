import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Maximize, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { VideoWatermark } from '../security/VideoWatermark';
import { ScreenDeterrenceWrapper } from '../security/ScreenDeterrenceWrapper';
import { useAuthStore } from '../../store/useAuthStore';

interface VideoPlayerProps {
  source: string;
  poster?: string;
  initialProgressSeconds?: number;
  onProgress?: (watchedSeconds: number, duration: number) => void;
  onComplete?: () => void;
  title?: string;
}

function toYoutubeEmbed(url: string): string | null {
  if (url.includes('youtube.com/embed/')) return url;
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (/youtube\.com/.test(url) && watch) {
    return `https://www.youtube.com/embed/${watch[1]}`;
  }
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  return null;
}

function resolvePlayer(source: string): { mode: 'iframe' | 'html5' | 'empty'; src: string } {
  const value = source.trim();
  if (!value || value.startsWith('videocipher:')) {
    return { mode: 'empty', src: '' };
  }

  if (/player\.vdocipher\.com|vdocipher\.com/i.test(value)) {
    return { mode: 'iframe', src: value };
  }

  const youtube = toYoutubeEmbed(value);
  if (youtube) {
    return { mode: 'iframe', src: youtube };
  }

  if (/vimeo\.com|\/embed\//i.test(value)) {
    return { mode: 'iframe', src: value };
  }

  if (/^https?:\/\//i.test(value)) {
    return { mode: 'html5', src: value };
  }

  return { mode: 'empty', src: '' };
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  source,
  poster,
  initialProgressSeconds = 0,
  onProgress,
  onComplete,
  title,
}) => {
  const user = useAuthStore((state) => state.user);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const player = resolvePlayer(source);
  const isIframe = player.mode === 'iframe';

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

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
    setProgress((curr / dur) * 100);
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
    <ScreenDeterrenceWrapper className="w-full">
      <div
        ref={containerRef}
        className="relative aspect-video w-full glass-panel rounded-3xl overflow-hidden border border-blue-900/40 bg-black group select-none shadow-2xl"
      >
        {/* Dynamic Anti-Recording Floating Watermark */}
        <VideoWatermark user={user} />

        {player.mode === 'iframe' ? (
          <iframe
            src={player.src}
            title={title || 'فيديو الدرس'}
            className="w-full h-full border-0"
            allow="encrypted-media; autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : player.mode === 'html5' ? (
        <>
          <video
            ref={videoRef}
            src={player.src}
            poster={poster}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-4 opacity-90 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
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

                <button type="button" onClick={toggleMute} className="p-1.5 text-slate-300 hover:text-white">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="font-mono dir-ltr">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
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

                <button type="button" onClick={toggleFullscreen} className="p-1.5 text-slate-300 hover:text-white">
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
            لا يمكن تشغيل هذا الفيديو
          </div>
        )}
      </div>
    </ScreenDeterrenceWrapper>
  );
};
