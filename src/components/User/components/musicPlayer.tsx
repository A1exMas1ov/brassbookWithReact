import { useEffect, useState, useId, useRef, useCallback } from "react";
import * as Tone from "tone";
import bethoven_menuet from "/src/assets/music/bethoven_menuet.mp3";
import playerClasses from "../styles/musicPlayer.module.css";

function IconDownload() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 7.5H10.625V11.2L12.35 9.475C12.475 9.35 12.6333 9.29167 12.7917 9.29167C12.95 9.29167 13.1083 9.35 13.2333 9.475C13.475 9.71667 13.475 10.1167 13.2333 10.3583L10.4417 13.15C10.2 13.3917 9.79999 13.3917 9.55832 13.15L6.76666 10.3583C6.52499 10.1167 6.52499 9.71667 6.76666 9.475C7.00832 9.23333 7.40832 9.23333 7.64999 9.475L9.37499 11.2V7.5H5.99999C3.33332 7.5 1.66666 9.16667 1.66666 11.8333V13.9917C1.66666 16.6667 3.33332 18.3333 5.99999 18.3333H13.9917C16.6583 18.3333 18.325 16.6667 18.325 14V11.8333C18.3333 9.16667 16.6667 7.5 14 7.5Z" fill="#6B27FF"/>
      <path d="M10.625 2.29166C10.625 1.95 10.3417 1.66666 10 1.66666C9.65833 1.66666 9.375 1.95 9.375 2.29166V7.5H10.625V2.29166Z" fill="#6B27FF"/>
    </svg>
  );
}
function IconTone() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.3333 6.50834V10.4167H14.9333C14.8333 10.4083 14.6167 10.2833 14.5667 10.1917L13.7 8.55C13.3583 7.90001 12.7667 7.53334 12.1333 7.56667C11.5 7.6 10.9583 8.025 10.6833 8.71667L9.53332 11.6L9.36666 11.1667C8.95832 10.1083 7.79166 9.30834 6.64166 9.30834L1.66666 9.33334V6.50834C1.66666 3.475 3.47499 1.66667 6.50832 1.66667H13.4917C16.525 1.66667 18.3333 3.475 18.3333 6.50834Z" fill="#230B3F"/>
      <path d="M18.3333 13.4917V11.6667H14.9333C14.375 11.6667 13.7167 11.2667 13.4583 10.775L12.5917 9.13334C12.3583 8.69167 12.025 8.71667 11.8417 9.175L9.92499 14.0167C9.71666 14.5583 9.36666 14.5583 9.14999 14.0167L8.19999 11.6167C7.97499 11.0333 7.27499 10.5583 6.64999 10.5583L1.66666 10.5833V13.4917C1.66666 16.475 3.41666 18.275 6.35832 18.325C6.44999 18.3333 6.54999 18.3333 6.64166 18.3333H13.3083C13.4333 18.3333 13.5583 18.3333 13.675 18.325C16.6 18.2583 18.3333 16.4667 18.3333 13.4917Z" fill="#230B3F"/>
      <path d="M1.66666 10.5833V13.3417C1.65 13.075 1.64166 12.7917 1.64166 12.5V10.5833H1.66666Z" fill="#230B3F"/>
    </svg>

  );
}
function IconTempo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_540_4155)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M20 0H0V20H20V0ZM4.55 10C4.55 6.99005 6.99005 4.55 10 4.55C13.01 4.55 15.45 6.99005 15.45 10C15.45 13.01 13.01 15.45 10 15.45C6.99005 15.45 4.55 13.01 4.55 10ZM10 3.45C6.38253 3.45 3.45 6.38253 3.45 10C3.45 13.6175 6.38253 16.55 10 16.55C13.6175 16.55 16.55 13.6175 16.55 10C16.55 6.38253 13.6175 3.45 10 3.45ZM6.35 10C6.35 7.98416 7.98416 6.35 10 6.35C10.3038 6.35 10.55 6.10376 10.55 5.8C10.55 5.49624 10.3038 5.25 10 5.25C7.37665 5.25 5.25 7.37665 5.25 10C5.25 10.3038 5.49624 10.55 5.8 10.55C6.10376 10.55 6.35 10.3038 6.35 10ZM13.0889 7.68891C13.3036 7.47412 13.3036 7.12588 13.0889 6.91109C12.8741 6.6963 12.5258 6.6963 12.311 6.91109L10.3254 8.89669C10.2222 8.86631 10.113 8.85 10 8.85C9.36487 8.85 8.85 9.36487 8.85 10C8.85 10.6351 9.36487 11.15 10 11.15C10.6351 11.15 11.15 10.6351 11.15 10C11.15 9.88694 11.1337 9.77769 11.1033 9.67448L13.0889 7.68891Z" fill="#230B3F"/>
      </g>
      <defs>
        <clipPath id="clip0_540_4155">
          <rect x="1" y="1" width="18" height="18" rx="5" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
function IconMinus() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.9333 6.81667H9.74164H5.06664C4.26664 6.81667 3.86664 7.78333 4.43331 8.35L8.74997 12.6667C9.44164 13.3583 10.5666 13.3583 11.2583 12.6667L12.9 11.025L15.575 8.35C16.1333 7.78333 15.7333 6.81667 14.9333 6.81667Z" fill="#230B3F"/>
    </svg>
  )
}
function IconPlus() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5666 11.65L12.8916 8.97501L11.2583 7.33334C10.5666 6.64167 9.44164 6.64167 8.74998 7.33334L4.43331 11.65C3.86664 12.2167 4.27498 13.1833 5.06664 13.1833H9.74164H14.9333C15.7333 13.1833 16.1333 12.2167 15.5666 11.65Z" fill="#230B3F"/>
    </svg>
  )
}
function IconSound() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 13.75C2.15833 13.75 1.875 13.4667 1.875 13.125V6.875C1.875 6.53333 2.15833 6.25 2.5 6.25C2.84167 6.25 3.125 6.53333 3.125 6.875V13.125C3.125 13.4667 2.84167 13.75 2.5 13.75Z" fill="#6B27FF"/>
      <path d="M6.25 15.8333C5.90833 15.8333 5.625 15.55 5.625 15.2083V4.79167C5.625 4.45 5.90833 4.16667 6.25 4.16667C6.59167 4.16667 6.875 4.45 6.875 4.79167V15.2083C6.875 15.55 6.59167 15.8333 6.25 15.8333Z" fill="#6B27FF"/>
      <path d="M10 17.9167C9.65833 17.9167 9.375 17.6333 9.375 17.2917V2.70833C9.375 2.36667 9.65833 2.08333 10 2.08333C10.3417 2.08333 10.625 2.36667 10.625 2.70833V17.2917C10.625 17.6333 10.3417 17.9167 10 17.9167Z" fill="#6B27FF"/>
      <path d="M13.75 15.8333C13.4083 15.8333 13.125 15.55 13.125 15.2083V4.79167C13.125 4.45 13.4083 4.16667 13.75 4.16667C14.0917 4.16667 14.375 4.45 14.375 4.79167V15.2083C14.375 15.55 14.0917 15.8333 13.75 15.8333Z" fill="#6B27FF"/>
      <path d="M17.5 13.75C17.1583 13.75 16.875 13.4667 16.875 13.125V6.875C16.875 6.53333 17.1583 6.25 17.5 6.25C17.8417 6.25 18.125 6.53333 18.125 6.875V13.125C18.125 13.4667 17.8417 13.75 17.5 13.75Z" fill="#6B27FF"/>
    </svg>
  )
}
function PlayIcon() {
  return (
    <svg width="27" height="31" viewBox="0 0 27 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25.5 12.5308C27.5 13.6855 27.5 16.5722 25.5 17.7269L4.5 29.8513C2.5 31.006 -1.50515e-06 29.5626 -1.4042e-06 27.2532L-3.44255e-07 3.00448C-2.43308e-07 0.695075 2.5 -0.748303 4.5 0.406398L25.5 12.5308Z" fill="#230B3F"/>
    </svg>
  )
}
function PauseIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.75 31.85V8.15C17.75 5.9 16.8 5 14.4 5H8.35C5.95 5 5 5.9 5 8.15V31.85C5 34.1 5.95 35 8.35 35H14.4C16.8 35 17.75 34.1 17.75 31.85Z" fill="#230B3F"/>
      <path d="M35 31.85V8.15C35 5.9 34.05 5 31.65 5H25.6C23.2167 5 22.25 5.9 22.25 8.15V31.85C22.25 34.1 23.2 35 25.6 35H31.65C34.05 35 35 34.1 35 31.85Z" fill="#230B3F"/>
    </svg>
  )
}
function IconPrevTrack() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25.6667 9.73V18.27C25.6667 20.02 23.765 21.1167 22.2483 20.2417L18.55 18.1067L14.8517 15.9717L14.28 15.645V12.355L14.8517 12.0283L18.55 9.89334L22.2483 7.75834C23.765 6.88334 25.6667 7.98 25.6667 9.73Z" fill="#230B3F"/>
      <path d="M14.28 9.73V18.27C14.28 20.02 12.3783 21.1167 10.8733 20.2417L7.16333 18.1067L3.46499 15.9717C1.95999 15.0967 1.95999 12.9033 3.46499 12.0283L7.16333 9.89334L10.8733 7.75834C12.3783 6.88334 14.28 7.98 14.28 9.73Z" fill="#230B3F"/>
    </svg>
  );
}
function IconNextTrack() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scaleX(-1)" }}>
      <path d="M25.6667 9.73V18.27C25.6667 20.02 23.765 21.1167 22.2483 20.2417L18.55 18.1067L14.8517 15.9717L14.28 15.645V12.355L14.8517 12.0283L18.55 9.89334L22.2483 7.75834C23.765 6.88334 25.6667 7.98 25.6667 9.73Z" fill="#230B3F"/>
      <path d="M14.28 9.73V18.27C14.28 20.02 12.3783 21.1167 10.8733 20.2417L7.16333 18.1067L3.46499 15.9717C1.95999 15.0967 1.95999 12.9033 3.46499 12.0283L7.16333 9.89334L10.8733 7.75834C12.3783 6.88334 14.28 7.98 14.28 9.73Z" fill="#230B3F"/>
    </svg>
  );
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
      try { sourceRef.current?.stop(); } catch {
        //бла бла бла
      }
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
    } catch {
      //бла бла бла
    }

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
      } catch {
        //бла бла бла
      }
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
          <IconPrevTrack />
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
          <IconNextTrack />
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
