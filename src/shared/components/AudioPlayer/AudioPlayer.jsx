import { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ audioUrl, isMyMessage = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState([]);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  // Generar datos de forma de onda simulados (barras aleatorias)
  useEffect(() => {
    const bars = Array.from({ length: 40 }, () => Math.random() * 0.7 + 0.3);
    setWaveformData(bars);
  }, []);

  // Cargar metadata del audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Actualizar tiempo actual mientras se reproduce
  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current && isPlaying) {
        setCurrentTime(audioRef.current.currentTime);
        animationRef.current = requestAnimationFrame(updateTime);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateTime);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-2xl max-w-[280px] sm:max-w-[320px] ${isMyMessage
        ? 'bg-white/10'
        : 'bg-gray-100 dark:bg-gray-700'
      }`}>
      {/* Audio element oculto */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Botón Play/Pause */}
      <button
        onClick={togglePlayPause}
        className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all hover:scale-105 ${isMyMessage
            ? 'bg-white/20 hover:bg-white/30'
            : 'bg-primary hover:bg-primary/90'
          }`}
      >
        <span className={`material-symbols-outlined text-xl sm:text-2xl ${isMyMessage ? 'text-white' : 'text-white'
          }`}>
          {isPlaying ? 'pause' : 'play_arrow'}
        </span>
      </button>

      {/* Waveform y tiempo */}
      <div className="flex-1 min-w-0">
        {/* Forma de onda */}
        <div
          className="flex items-center gap-[2px] h-8 sm:h-10 cursor-pointer mb-1"
          onClick={handleSeek}
        >
          {waveformData.map((height, index) => {
            const barProgress = (index / waveformData.length) * 100;
            const isActive = barProgress <= progress;

            return (
              <div
                key={index}
                className={`flex-1 rounded-full transition-all ${isMyMessage
                    ? isActive ? 'bg-white' : 'bg-white/30'
                    : isActive ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                style={{
                  height: `${height * 100}%`,
                  minWidth: '2px',
                  maxWidth: '3px'
                }}
              />
            );
          })}
        </div>

        {/* Tiempo */}
        <div className={`flex justify-between text-[10px] sm:text-xs ${isMyMessage ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
          }`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;


