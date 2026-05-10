import { useEffect, useState, useId, useRef, useCallback } from "react";
import * as Tone from "tone";
import bethoven_menuet from "/src/assets/music/bethoven_menuet.mp3";
import playerClasses from "../styles/musicPlayer.module.css";

function IconDownload() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2v9m0 0-3-3m3 3 3-3M3 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconTone() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 3v12M5 7l4-4 4 4M5 11l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconTempo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="12" width="2" height="4" rx="1" fill="currentColor"/>
      <rect x="6" y="8" width="2" height="8" rx="1" fill="currentColor"/>
      <rect x="10" y="5" width="2" height="11" rx="1" fill="currentColor"/>
      <rect x="14" y="2" width="2" height="14" rx="1" fill="currentColor"/>
    </svg>
  );
}
function IconMinus() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconPlus() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconSound() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 6.5h2l3-3.5v12L4 11.5H2v-5Zm10 .5a3 3 0 0 1 0 4m2-6a6 6 0 0 1 0 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function PlayIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
}
function PauseIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
}

type VersionId = "original" | "brassbook" | "personal";

const VERSIONS: { id: VersionId; label: string; bg: string }[] = [
  { id: "original",  label: "Оригинальная версия", bg: "linear-gradient(135deg,#c4b5fd,#7c3aed)" },
  { id: "brassbook", label: "Версия от BrassBook",  bg: "linear-gradient(135deg,#a5b4fc,#4f46e5)" },
  { id: "personal",  label: "Личная запись",        bg: "linear-gradient(135deg,#d1d5db,#9ca3af)" },
];

function formatTime(s: number) {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function MusicPlayer() {
  const progressId = useId();

  const audioCtxRef    = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef      = useRef<AudioBufferSourceNode | null>(null);
  const pitchShiftRef  = useRef<Tone.PitchShift | null>(null);

  const offsetAtStartRef = useRef(0);
  const ctxTimeAtStartRef = useRef(0);
  const rateRef     = useRef(1);
  const tonalityRef = useRef(0);

  const [isPlaying,       setIsPlaying]     = useState(false);
  const [progress,        setProgress]      = useState(0);
  const [totalDuration,   setTotalDuration] = useState(0);
  const [tonality,        setTonality]      = useState(0);
  const [tempo,           setTempo]         = useState(0);
  const [selectedVersion, setVersion]       = useState<VersionId>("brassbook");
  const [rating,          setRating]        = useState(0);
  const [hoverRating,     setHoverRating]   = useState(0);
  const [isLoaded,        setIsLoaded]      = useState(false);

  useEffect(() => {
    const toneCtx = Tone.getContext();
    const ctx = toneCtx.rawContext as AudioContext;
    audioCtxRef.current = ctx;

    const shifter = new Tone.PitchShift({ pitch: 0 }).toDestination();
    pitchShiftRef.current = shifter;

    fetch(bethoven_menuet)
      .then(r => r.arrayBuffer())
      .then(ab => ctx.decodeAudioData(ab))
      .then(buffer => {
        audioBufferRef.current = buffer;
        setTotalDuration(buffer.duration);
        setIsLoaded(true);
      })
      .catch(console.error);

    return () => {
      try { sourceRef.current?.stop(); } catch {}
      sourceRef.current?.disconnect();
      shifter.dispose();
    };
  }, []);

  const startSource = useCallback((offsetSeconds: number) => {
    const ctx    = audioCtxRef.current;
    const buffer = audioBufferRef.current;
    const shift  = pitchShiftRef.current;
    if (!ctx || !buffer || !shift) return;

    try {
      sourceRef.current?.stop();
      sourceRef.current?.disconnect();
    } catch {}

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rateRef.current;

    const shiftNativeInput = (shift.input as any).input as AudioNode;
    source.connect(shiftNativeInput);

    const clampedOffset = Math.max(0, Math.min(buffer.duration, offsetSeconds));
    source.start(0, clampedOffset);

    offsetAtStartRef.current  = clampedOffset;
    ctxTimeAtStartRef.current = ctx.currentTime;

    source.onended = () => {
      const elapsed = (ctx.currentTime - ctxTimeAtStartRef.current) * rateRef.current;
      if (offsetAtStartRef.current + elapsed >= buffer.duration - 0.2) {
        setIsPlaying(false);
        setProgress(0);
        offsetAtStartRef.current = 0;
      }
    };

    sourceRef.current = source;
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const elapsed = (ctx.currentTime - ctxTimeAtStartRef.current) * rateRef.current;
      const pos = offsetAtStartRef.current + elapsed;
      const clamped = Math.min(pos, totalDuration);
      setProgress(clamped);
    }, 200);
    return () => clearInterval(id);
  }, [isPlaying, totalDuration]);

  useEffect(() => {
    tonalityRef.current = tonality;
    if (pitchShiftRef.current) {
      const compensation = -12 * Math.log2(rateRef.current);
      pitchShiftRef.current.pitch = tonality + compensation;
    }
  }, [tonality]);

  useEffect(() => {
    const rate = Math.max(0.5, Math.min(4, 1 + tempo));

    const ctx = audioCtxRef.current;
    if (ctx && sourceRef.current) {
      const oldElapsed = (ctx.currentTime - ctxTimeAtStartRef.current) * rateRef.current;
      offsetAtStartRef.current  = offsetAtStartRef.current + oldElapsed;
      ctxTimeAtStartRef.current = ctx.currentTime;
    }

    rateRef.current = rate;

    if (sourceRef.current) {
      sourceRef.current.playbackRate.value = rate;
    }

    if (pitchShiftRef.current) {
      const compensation = -12 * Math.log2(rate);
      pitchShiftRef.current.pitch = tonalityRef.current + compensation;
    }
  }, [tempo]);

  const togglePlayPause = useCallback(async () => {
    await Tone.start();

    if (isPlaying) {
      const ctx = audioCtxRef.current;
      if (ctx) {
        const elapsed = (ctx.currentTime - ctxTimeAtStartRef.current) * rateRef.current;
        offsetAtStartRef.current = offsetAtStartRef.current + elapsed;
      }
      try {
        sourceRef.current?.stop();
        sourceRef.current?.disconnect();
      } catch {}
      sourceRef.current = null;
      setIsPlaying(false);
    } else {
      startSource(offsetAtStartRef.current);
      setIsPlaying(true);
    }
  }, [isPlaying, startSource]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    offsetAtStartRef.current = newTime;
    setProgress(newTime);

    if (isPlaying) {
      startSource(newTime);
    }
  }, [isPlaying, startSource]);

  const pct = totalDuration
    ? Math.max(0, Math.min(100, (progress / totalDuration) * 100))
    : 0;

  const decTonality = useCallback(() => setTonality(v => Math.max(-6, +(v - 0.5).toFixed(1))), []);
  const incTonality = useCallback(() => setTonality(v => Math.min( 6, +(v + 0.5).toFixed(1))), []);

  const decTempo    = useCallback(() => setTempo   (v => Math.max(-0.5, +(v - 0.1).toFixed(1))), []);
  const incTempo    = useCallback(() => setTempo   (v => Math.min( 1,   +(v + 0.1).toFixed(1))), []);

  return (
    <div className={playerClasses.player}>

      <div className={playerClasses.player__header}>
        <div className={playerClasses.player__cover}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #a78bfa, #6d28d9)" }} aria-hidden="true" />
          <div className={playerClasses.player__cover__overlay} aria-hidden="true" />
        </div>
        <div className={playerClasses.player__meta}>
          <div>
            <p className={playerClasses.player__composer}>Бетховен</p>
            <p className={playerClasses.player__track}>Менуэт</p>
          </div>
          <p className={playerClasses.player__version}>Версия от BrassBook</p>
        </div>
      </div>

      <div className={playerClasses.player__progress__wrap}>
        <div className={playerClasses.player__progress__track}>
          <div className={playerClasses.player__progress__fill} style={{ width: `${pct}%` }} />
          <div className={playerClasses.player__progress__thumb} style={{ left: `${pct}%` }} />
          <input
            id={progressId}
            type="range"
            min={0}
            max={totalDuration || 1}
            step={0.1}
            value={progress}
            onChange={handleSeek}
            className={playerClasses.player__progress__input}
            aria-valuetext={`${formatTime(progress)} из ${formatTime(totalDuration)}`}
          />
        </div>
        <div className={playerClasses.player__progress__times}>
          <span className={playerClasses.player__time}>{formatTime(progress)}</span>
          <span className={playerClasses.player__time}>{formatTime(totalDuration)}</span>
        </div>
      </div>

      <div className={playerClasses.player__controls} aria-label="Управление воспроизведением">
        <button type="button" className={playerClasses.control__btn} aria-label="Предыдущий трек">
          <span className={playerClasses.control__icon}>⏮</span>
        </button>
        <button
          type="button"
          className={`${playerClasses.control__btn} ${playerClasses["control__btn--play"]}`}
          onClick={togglePlayPause}
          disabled={!isLoaded}
          aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button type="button" className={playerClasses.control__btn} aria-label="Следующий трек">
          <span className={playerClasses.control__icon}>⏭</span>
        </button>
      </div>

      <div className={playerClasses.player__settings}>
        <div className={playerClasses.player__setting__row}>
          <span className={playerClasses.player__setting__label}><IconTone /> Тональность</span>
          <div className={playerClasses.player__setting__controls}>
            <button type="button" className={playerClasses.player__setting__btn} onClick={decTonality} aria-label="Уменьшить тональность" disabled={tonality <= -6}><IconMinus /></button>
            <span className={playerClasses.player__setting__value}>{tonality > 0 ? `+${tonality}` : tonality}</span>
            <button type="button" className={playerClasses.player__setting__btn} onClick={incTonality} aria-label="Увеличить тональность" disabled={tonality >= 6}><IconPlus /></button>
          </div>
        </div>
        <div className={playerClasses.player__setting__row}>
          <span className={playerClasses.player__setting__label}><IconTempo /> Темп</span>
          <div className={playerClasses.player__setting__controls}>
            <button type="button" className={playerClasses.player__setting__btn} onClick={decTempo} aria-label="Уменьшить темп" disabled={tempo <= -0.5}><IconMinus /></button>
            <span className={playerClasses.player__setting__value}>{tempo > 0 ? `+${tempo.toFixed(1)}` : tempo.toFixed(1)}</span>
            <button type="button" className={playerClasses.player__setting__btn} onClick={incTempo} aria-label="Увеличить темп" disabled={tempo >= 1}><IconPlus /></button>
          </div>
        </div>
      </div>

      <button type="button" className={playerClasses.player__download} aria-label="Скачать композицию">
        <span className={playerClasses.player__download__label}><IconDownload /> Скачать композицию</span>
      </button>

      <div>
        <p className={playerClasses.player__versions__label}>Выбери версию произведения:</p>
        <div className={playerClasses.player__versions} role="radiogroup" aria-label="Версии произведения">
          {VERSIONS.map((v) => {
            const isSelected = selectedVersion === v.id;
            const nameClass = v.id === "personal"
              ? playerClasses["version__name--dimmed"]
              : isSelected
              ? playerClasses["version__name--active"]
              : playerClasses["version__name--default"];
            return (
              <button key={v.id} type="button" role="radio" aria-checked={isSelected} onClick={() => setVersion(v.id)} className={playerClasses.version__btn}>
                <span className={playerClasses.version__left}>
                  <span className={playerClasses.version__thumb} style={{ background: v.bg }}>
                    <span className={playerClasses.version__thumb__overlay} aria-hidden="true" />
                  </span>
                  <span className={`${playerClasses.version__name} ${nameClass}`}>{v.label}</span>
                </span>
                {v.id === "brassbook" && isSelected && <IconSound />}
                {v.id === "personal" && <span className={playerClasses.version__record__badge}>ЗАПИСАТЬ</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className={playerClasses.player__rating}>
        <p className={playerClasses.player__rating__label}>Оцени это произведение!</p>
        <div className={playerClasses.player__rating__stars} role="group" aria-label="Оценка произведения">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={playerClasses.star__btn + (star <= (hoverRating || rating) ? " " + playerClasses["star__btn--active"] : "")}
              aria-label={`Оценить на ${star}`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >★</button>
          ))}
        </div>
      </div>

    </div>
  );
}

export default MusicPlayer;