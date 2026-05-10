// components/EditAlbumModal/EditAlbumModal.tsx
import { useRef, useState } from "react";
import m from "./modal.module.css";

function IconGalleryAdd() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={m.cover__btn__icon}>
      <path d="M15 36.667H25c8.333 0 11.667-3.334 11.667-11.667V15c0-8.333-3.334-11.667-11.667-11.667H15C6.667 3.333 3.333 6.667 3.333 15v10c0 8.333 3.334 11.667 11.667 11.667Z" stroke="#230B3F" strokeOpacity=".3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 16.667a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="#230B3F" strokeOpacity=".3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.45 31.583 12.667 25.8c1.35-.933 3.3-.833 4.5.233l.55.5c1.317 1.167 3.417 1.167 4.733 0l6.9-6.116c1.317-1.167 3.417-1.167 4.733 0l2.584 2.283" stroke="#230B3F" strokeOpacity=".3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M13.5 4.5 4.5 13.5M4.5 4.5l9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M15.75 4.484a57.57 57.57 0 0 0-5.692-.367V4.11l-.143-.855a1.107 1.107 0 0 0-1.102-.938H9.18a1.107 1.107 0 0 0-1.102.938l-.135.817v.308a58.05 58.05 0 0 0-5.693.367.563.563 0 0 0 .075 1.124h.075l.593 7.8c.12 1.462 1.117 2.476 2.595 2.476h7.823c1.478 0 2.475-1.021 2.595-2.476l.593-7.8h.075a.563.563 0 0 0 .075-1.124ZM9 13.5a.563.563 0 0 1-.563-.563V8.063a.563.563 0 1 1 1.125 0v4.874A.563.563 0 0 1 9 13.5Zm2.25-.563a.563.563 0 0 1-1.125 0V8.063a.563.563 0 1 1 1.125 0v4.874Zm-4.5 0a.563.563 0 0 1-1.125 0V8.063a.563.563 0 1 1 1.125 0v4.874Z" fill="#db422b"/>
    </svg>
  );
}

interface Props {
  albumTitle?: string;
  albumCover?: string | null;
  onClose: () => void;
  onSaved?: (name: string, coverUrl: string | null) => void;
  onDeleted?: () => void;
}

export default function EditAlbumModal({ albumTitle = "", albumCover = null, onClose, onSaved, onDeleted }: Props) {
  const [name, setName] = useState(albumTitle);
  const [coverPreview, setCoverPreview] = useState<string | null>(albumCover);
  const fileRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isMouseDownInside = useRef(false);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview((prev) => { if (prev && prev !== albumCover) URL.revokeObjectURL(prev); return url; });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaved?.(name.trim(), coverPreview);
    onClose();
  };

  const handleDelete = () => {
    onDeleted?.();
    onClose();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownInside.current = modalRef.current?.contains(e.target as Node) ?? false;
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!isMouseDownInside.current && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={m.overlay} 
      onMouseDown={handleMouseDown}
      onClick={handleOverlayClick} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="edit-album-title"
    >
      <div className={m.modal} ref={modalRef}>
        <div className={m.modal__header}>
          <h2 id="edit-album-title" className={m.modal__title}>Редактирование альбома</h2>
          <button type="button" className={m.modal__close} onClick={onClose} aria-label="Закрыть">
            <IconClose />
          </button>
        </div>

        <form onSubmit={handleSave} className={m.form}>
          <div className={m.field}>
            <label htmlFor="album-name-edit" className={m.field__label}>Введи название</label>
            <input
              id="album-name-edit"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Название альбома"
              className={m.field__input}
              autoFocus
            />
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            style={{ display: "none" }}
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Выбрать обложку альбома"
            className={`${m.cover__btn} ${coverPreview ? m["cover__btn--has-image"] : ""}`}
            style={coverPreview ? { backgroundImage: `url(${coverPreview})` } : undefined}
          >
            {coverPreview && <div className={m.cover__btn__overlay} />}
            <div className={m.cover__btn__content}>
              <IconGalleryAdd />
              <span className={m.cover__btn__text}>Нажми, чтобы выбрать обложку альбома</span>
            </div>
          </button>

          <div className={m.btn__row}>
            <button type="button" className={m.btn__danger} onClick={handleDelete}>
              <IconTrash /> УДАЛИТЬ АЛЬБОМ
            </button>
            <button type="submit" className={m.btn__primary} disabled={!name.trim()}>
              СОХРАНИТЬ ИЗМЕНЕНИЯ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
