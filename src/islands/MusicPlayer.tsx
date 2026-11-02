import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { T } from "../components/ui/T.tsx";
import { CHORUS } from "../easter-egg/chorus.ts";
import { useLocalize } from "../i18n/useLocalize.ts";
import { hurricaneUnlocked, usePreference } from "../preferences/store.ts";

export interface MusicPlayerProps {
  src: string;
}

const DEFAULT_VOLUME = 0.8;
const TRACK_TITLE = CHORUS[2];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/** A small player for the song, shown once the easter egg has been found. */
export function MusicPlayer({ src }: MusicPlayerProps) {
  const isUnlocked = usePreference(hurricaneUnlocked) === "yes";
  const localize = useLocalize();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted, isUnlocked]);

  if (!isUnlocked) return null;

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch (playError) {
      console.error("The song could not start.", playError);
      setLoadFailed(true);
    }
  };

  const seek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Number(event.target.value);
  };

  const changeVolume = (event: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
    setIsMuted(false);
  };

  return (
    <section className="music-player" aria-label={localize({ en: "Music player", pt: "Player de música" })}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onError={() => setLoadFailed(true)}
      />
      <button
        type="button"
        className="music-player__play"
        onClick={togglePlayback}
        disabled={loadFailed}
        aria-label={localize(isPlaying ? { en: "Pause", pt: "Pausar" } : { en: "Play", pt: "Tocar" })}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {isPlaying ? <path d="M7 5h3v14H7zM14 5h3v14h-3z" /> : <path d="M8 5v14l11-7z" />}
        </svg>
      </button>

      <div className="music-player__track">
        <span className="music-player__title">{loadFailed ? <T en="The song could not be loaded." pt="Não foi possível carregar a música." /> : TRACK_TITLE}</span>
        <input
          type="range"
          className="music-player__seek"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={seek}
          disabled={!duration}
          aria-label={localize({ en: "Position in the song", pt: "Posição na música" })}
        />
        <span className="music-player__time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div className="music-player__volume">
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          aria-pressed={isMuted}
          aria-label={localize({ en: "Mute", pt: "Silenciar" })}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9h4l5-4v14l-5-4H4z" />
            {isMuted || volume === 0 ? <path className="stroke" d="M16 9l5 6M21 9l-5 6" /> : <path className="stroke" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" />}
          </svg>
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={isMuted ? 0 : volume}
          onChange={changeVolume}
          aria-label={localize({ en: "Volume", pt: "Volume" })}
        />
      </div>
    </section>
  );
}
