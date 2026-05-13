// components/ChangePasswordModal/ChangePasswordModal.tsx
import { NavLink } from "react-router-dom";
import { useId, useRef, useState } from "react";
import m from "./modal.module.css";

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M13.5 4.5 4.5 13.5M4.5 4.5l9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconEye = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconEyeOff = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M17.94 17.94C16.23 19.21 14.2 20 12 20C5 20 1 12 1 12C2.24 9.04 4.17 6.64 6.54 5.02M9.9 4.24C10.58 4.08 11.28 4 12 4C19 4 23 12 23 12C22.24 13.9 20.89 15.65 19.16 17.06M14.12 14.12C13.56 14.68 12.81 15 12 15C10.34 15 9 13.66 9 12C9 11.19 9.32 10.44 9.88 9.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 1L23 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface ChangePasswordModalProps {
  onClose: () => void;
  onSave?: (currentPassword: string, newPassword: string) => Promise<void>;
}

function ChangePasswordModal({ onClose, onSave }: ChangePasswordModalProps) {
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const isMouseDownInside = useRef(false);

  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownInside.current = modalRef.current?.contains(e.target as Node) ?? false;
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownInside.current && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSave?.(currentPassword, newPassword);
      onClose();
    } catch {
      setError("Не удалось изменить пароль. Проверь текущий пароль и попробуй снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={m.overlay}
      onMouseDown={handleMouseDown}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
    >
      <div className={m.modal} ref={modalRef}>

        <div className={m.modal__header}>
          <h2 id="change-password-title" className={m.modal__title}>Изменение пароля</h2>
          <button type="button" aria-label="Закрыть" className={m.modal__close} onClick={onClose}>
            <IconClose />
          </button>
        </div>

        <form className={m.form} onSubmit={handleSubmit}>

          <div className={m.field}>
            <label htmlFor={currentPasswordId} className={m.field__label}>
              Текущий пароль
            </label>
            <div style={{ position: "relative" }}>
              <input
                id={currentPasswordId}
                name="currentPassword"
                type={currentPasswordVisible ? "text" : "password"}
                value={currentPassword}
                placeholder="Введи текущий пароль"
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={m.field__input}
                style={{ paddingRight: 56 }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setCurrentPasswordVisible((v) => !v)}
                style={{
                  position: "absolute", right: 16, top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer",
                  color: "rgba(35, 11, 63, 0.4)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", padding: 4,
                }}
              >
                {currentPasswordVisible ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          <div className={m.field}>
            <label htmlFor={newPasswordId} className={m.field__label}>
              Новый пароль
            </label>
            <div style={{ position: "relative" }}>
              <input
                id={newPasswordId}
                name="newPassword"
                type={newPasswordVisible ? "text" : "password"}
                value={newPassword}
                placeholder="Введи новый пароль"
                onChange={(e) => setNewPassword(e.target.value)}
                className={m.field__input}
                style={{ paddingRight: 56 }}
              />
              <button
                type="button"
                onClick={() => setNewPasswordVisible((v) => !v)}
                style={{
                  position: "absolute", right: 16, top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer",
                  color: "rgba(35, 11, 63, 0.4)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", padding: 4,
                }}
              >
                {newPasswordVisible ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          <div className={m.forgot__password}>
            <span>Забыли пароль?</span>
            <NavLink to="/restore" className={m.forgot__passwordLink}>
              Восстановить
            </NavLink>
          </div>

          {error && (
            <p style={{ color: "red", fontSize: 13, margin: "4px 0 0" }}>{error}</p>
          )}

          <button type="submit" className={m.btn__primary} disabled={isSubmitting}>
            {isSubmitting ? "СОХРАНЕНИЕ..." : "ИЗМЕНИТЬ ПАРОЛЬ"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;