// components/MusicPlayer/MusicPlayer.tsx
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

// playbackRate меняет питч пропорционально скорости.
// Компенсируем это: pitchCompensation = -12 * log2(rate)
// чтобы итоговая тональность = только то, что выбрал пользователь.
function rateToPitchCompensation(tempoOffset: number): number {
  const rate = Math.max(0.5, 1 + tempoOffset);
  return -12 * Math.log2(rate);
}

function MusicPlayer() {
  const progressId = useId();
  const playIdRef = useRef(0);

  const playerRef  = useRef<Tone.Player | null>(null);
  const shifterRef = useRef<Tone.PitchShift | null>(null);
  const isSeekingRef = useRef(false);

  // Ref-версии живого состояния — нужны для колбэков Tone.js,
  // которые захватывают значения на момент создания и не обновляются через closure.
  const isPlayingRef   = useRef(false);
  const progressRef    = useRef(0);
  const startTimeRef   = useRef(0);
  const pauseOffsetRef = useRef(0);
  const tempoRef       = useRef(0);
  const isDraggingRef        = useRef(false);  // true пока пользователь держит ползунок
  const seekValueRef         = useRef(0);      // значение куда перетащили
  const wasPlayingBeforeSeek = useRef(false);  // играло ли до начала drag

  const [isPlaying,      setIsPlaying]      = useState(false);
  const [progress,       setProgress]       = useState(0);
  const [totalDuration,  setTotalDuration]  = useState(0);
  const [tonality,       setTonality]       = useState(0);
  const [tempo,          setTempo]          = useState(0);
  const [selectedVersion, setVersion]       = useState<VersionId>("brassbook");
  const [rating,         setRating]         = useState(0);
  const [hoverRating,    setHoverRating]    = useState(0);

  // Синхронизируем tempoRef с state
  useEffect(() => { tempoRef.current = tempo; }, [tempo]);

  
  // ── Init ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const shifter = new Tone.PitchShift({ pitch: 0 }).toDestination();

    const player = new Tone.Player({
      url: bethoven_menuet,
      autostart: false,
      loop: false,
      onstop: () => {
        // ❗ игнорируем stop при seek
        if (isSeekingRef.current) return;

        // ❗ игнорируем stop при паузе
        if (!isPlayingRef.current) return;

        // ✅ реально конец трека
        isPlayingRef.current = false;
        pauseOffsetRef.current = 0;
        progressRef.current = 0;

        setIsPlaying(false);
        setProgress(0);
      },
      onload: () => {
        if (player.buffer) setTotalDuration(player.buffer.duration);
      },
    }).connect(shifter);

    playerRef.current  = player;
    shifterRef.current = shifter;

    return () => { player.dispose(); shifter.dispose(); };
  }, []);

  // ── Питч = тональность пользователя + компенсация от темпа ─────────────
  useEffect(() => {
    if (!shifterRef.current) return;
    shifterRef.current.pitch = tonality + rateToPitchCompensation(tempo);
  }, [tonality, tempo]);

  // ── Темп = только скорость, питч компенсируется выше ────────────────────
  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.playbackRate = Math.max(0.5, 1 + tempo);
  }, [tempo]);

  // ── Тик прогресс-бара ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      if (isDraggingRef.current) return; // не двигаем ползунок во время drag
      const rate    = Math.max(0.5, 1 + tempoRef.current);
      const elapsed = (Tone.now() - startTimeRef.current) * rate;
      const clamped = Math.min(elapsed, totalDuration);
      progressRef.current = clamped;
      setProgress(clamped);
    }, 100);
    return () => clearInterval(id);
  }, [isPlaying, totalDuration]);

  // ── Play / Pause ─────────────────────────────────────────────────────────
 const togglePlayPause = useCallback(async () => {
  await Tone.start();
  const player = playerRef.current;
  if (!player || !player.loaded) return;

  if (isPlayingRef.current) {
    // 👉 PAUSE
    isPlayingRef.current   = false;
    pauseOffsetRef.current = progressRef.current;

    playIdRef.current += 1; // ❗ инвалидируем текущий play
    player.stop();

    setIsPlaying(false);
  } else {
    // 👉 PLAY / RESUME
    const offset =
      pauseOffsetRef.current >= totalDuration && totalDuration > 0
        ? 0
        : pauseOffsetRef.current;

    const rate = Math.max(0.5, 1 + tempoRef.current);

    startTimeRef.current   = Tone.now() - offset / rate;
    pauseOffsetRef.current = offset;
    progressRef.current    = offset;

    isPlayingRef.current = true;

    const id = ++playIdRef.current; // ❗ новый playId
    player.start(Tone.now(), offset);

    setProgress(offset);
    setIsPlaying(true);
  }
}, [totalDuration]);
  // ── Seek: три фазы — drag start / drag move / drag end ──────────────────

  // Начало перетаскивания: останавливаем плеер, запоминаем что тащим
    const handleSeekStart = useCallback(() => {
      const player = playerRef.current;

      isDraggingRef.current = true;
      isSeekingRef.current = true; // ← ВАЖНО СТАВИТЬ РАНЬШЕ ВСЕГО

      if (isPlayingRef.current && player) {
        isPlayingRef.current = false;

        playIdRef.current += 1;

        player.stop();
      }
    }, []);

  // Движение ползунка: только обновляем визуал, плеер не трогаем
  const handleSeekChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);

    seekValueRef.current = val;
    progressRef.current  = val;
    setProgress(val);

    const player = playerRef.current;
    if (!player || !player.loaded) return;

    // 👉 ЕСЛИ ЭТО НЕ DRAG — значит это клик
    if (!isDraggingRef.current) {
      const rate = Math.max(0.5, 1 + tempoRef.current);

      pauseOffsetRef.current = val;
      startTimeRef.current   = Tone.now() - val / rate;

      if (isPlayingRef.current) {
        playIdRef.current += 1;
        player.stop();
        player.start(Tone.now(), val);
      }
    }
  }, []);

  // Отпустили ползунок: применяем позицию и возобновляем если играло
  const handleSeekEnd = useCallback((wasPlaying: boolean) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    isSeekingRef.current = false; // 👈 ДОБАВИТЬ

    const player = playerRef.current;
    if (!player || !player.loaded) return;

    const newTime = seekValueRef.current;
    const rate    = Math.max(0.5, 1 + tempoRef.current);

    pauseOffsetRef.current = newTime;
    progressRef.current    = newTime;
    startTimeRef.current   = Tone.now() - newTime / rate;

    if (wasPlaying) {
      isPlayingRef.current = true;

      const id = ++playIdRef.current; // 👈 ДОБАВИТЬ
      player.start(Tone.now(), newTime);

      setIsPlaying(true);
    }
  }, []);
  useEffect(() => {
  const stop = () => {
    if (isDraggingRef.current) {
      handleSeekEnd(wasPlayingBeforeSeek.current);
    }
  };

  window.addEventListener("mouseup", stop);
  window.addEventListener("touchend", stop);

  return () => {
    window.removeEventListener("mouseup", stop);
    window.removeEventListener("touchend", stop);
  };
}, [handleSeekEnd]);

  const pct = totalDuration
    ? Math.max(0, Math.min(100, (progress / totalDuration) * 100))
    : 0;

  const decTonality = useCallback(() => setTonality(v => Math.max(-6,  +(v - 0.5).toFixed(1))), []);
  const incTonality = useCallback(() => setTonality(v => Math.min( 6,  +(v + 0.5).toFixed(1))), []);
  const decTempo    = useCallback(() => setTempo   (v => Math.max(-0.5, +(v - 0.1).toFixed(1))), []);
  const incTempo    = useCallback(() => setTempo   (v => Math.min( 1,  +(v + 0.1).toFixed(1))), []);

  return (
    <div className={playerClasses.player}>

      {/* Шапка */}
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

      {/* Прогресс */}
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

          onMouseDown={() => {
            seekValueRef.current = progress;
            wasPlayingBeforeSeek.current = isPlayingRef.current;
            handleSeekStart();
          }}

          onTouchStart={() => {
            seekValueRef.current = progress;
            wasPlayingBeforeSeek.current = isPlayingRef.current;
            handleSeekStart();
          }}

          onChange={handleSeekChange}

          onMouseUp={() => handleSeekEnd(wasPlayingBeforeSeek.current)}
          onTouchEnd={() => handleSeekEnd(wasPlayingBeforeSeek.current)}

          className={playerClasses.player__progress__input}
        />
        </div>
        <div className={playerClasses.player__progress__times}>
          <span className={playerClasses.player__time}>{formatTime(progress)}</span>
          <span className={playerClasses.player__time}>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Кнопки управления */}
      <div className={playerClasses.player__controls} aria-label="Управление воспроизведением">
        <button type="button" className={playerClasses.control__btn} aria-label="Предыдущий трек">
          <span className={playerClasses.control__icon}>⏮</span>
        </button>
        <button
          type="button"
          className={`${playerClasses.control__btn} ${playerClasses["control__btn--play"]}`}
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button type="button" className={playerClasses.control__btn} aria-label="Следующий трек">
          <span className={playerClasses.control__icon}>⏭</span>
        </button>
      </div>

      {/* Тональность / Темп */}
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

      {/* Скачать */}
      <button type="button" className={playerClasses.player__download} aria-label="Скачать композицию">
        <span className={playerClasses.player__download__label}><IconDownload /> Скачать композицию</span>
      </button>

      {/* Версии */}
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

      {/* Оценка */}
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