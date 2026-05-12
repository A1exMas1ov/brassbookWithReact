// components/EditProfileModal/EditProfileModal.tsx
import { useState, useRef } from "react";
import m from "./modal.module.css";

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M13.5 4.5 4.5 13.5M4.5 4.5l9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

type TabId = "personal" | "corporate";

interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
}

interface CorporateData {
  companyName: string;
  position: string;
  inn: string;
}

interface Props {
  onClose: () => void;
  initialPersonal?: Partial<PersonalData>;
  initialCorporate?: Partial<CorporateData>;
  onSave?: (personal: PersonalData, corporate: CorporateData) => Promise<void>;
}

export default function EditProfileModal({
  onClose,
  initialPersonal = {},
  initialCorporate = {},
  onSave,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isMouseDownInside = useRef(false);

  const [personal, setPersonal] = useState<PersonalData>({
    firstName: initialPersonal.firstName ?? "",
    lastName:  initialPersonal.lastName  ?? "",
    email:     initialPersonal.email     ?? "",
  });

  const [corporate, setCorporate] = useState<CorporateData>({
    companyName: initialCorporate.companyName ?? "",
    position:    initialCorporate.position    ?? "",
    inn:         initialCorporate.inn         ?? "",
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownInside.current = modalRef.current?.contains(e.target as Node) ?? false;
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!isMouseDownInside.current && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSave?.(personal, corporate);
      onClose();
    } catch {
      setError("Не удалось сохранить изменения. Попробуй снова.");
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
      aria-labelledby="edit-profile-title"
    >
      <div className={m.modal} style={{ maxWidth: 560 }} ref={modalRef}>

        <div className={m.modal__header}>
          <h2 id="edit-profile-title" className={m.modal__title}>Редактирование данных</h2>
          <button type="button" className={m.modal__close} onClick={onClose} aria-label="Закрыть">
            <IconClose />
          </button>
        </div>

        <nav className={m.tabs} aria-label="Разделы редактирования">
          {(["personal", "corporate"] as TabId[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`${m.tab} ${activeTab === tab ? m["tab--active"] : ""}`}
              aria-current={activeTab === tab ? "page" : undefined}
              onClick={() => setActiveTab(tab)}
            >
              <span className={m.tab__label}>
                {tab === "personal" ? "ЛИЧНЫЕ ДАННЫЕ" : "КОРПОРАТИВНЫЕ ДАННЫЕ"}
              </span>
              {activeTab === tab && <div className={m.tab__indicator} />}
            </button>
          ))}
        </nav>

        <form onSubmit={handleSave} className={m.form}>
          {activeTab === "personal" ? (
            <>
              <div className={m.form__row}>
                <div className={m.field}>
                  <label htmlFor="edit-firstname" className={m.field__label}>Имя</label>
                  <input
                    id="edit-firstname"
                    type="text"
                    value={personal.firstName}
                    onChange={(e) => setPersonal(p => ({ ...p, firstName: e.target.value }))}
                    placeholder="Имя"
                    className={`${m.field__input} ${m.field__input__small}`}
                    autoFocus
                  />
                </div>
                <div className={m.field}>
                  <label htmlFor="edit-lastname" className={m.field__label}>Фамилия</label>
                  <input
                    id="edit-lastname"
                    type="text"
                    value={personal.lastName}
                    onChange={(e) => setPersonal(p => ({ ...p, lastName: e.target.value }))}
                    placeholder="Фамилия"
                    className={`${m.field__input} ${m.field__input__small}`}
                  />
                </div>
              </div>
              <div className={m.field}>
                <label htmlFor="edit-email" className={m.field__label}>Почта</label>
                <input
                  id="edit-email"
                  type="email"
                  value={personal.email}
                  onChange={(e) => setPersonal(p => ({ ...p, email: e.target.value }))}
                  placeholder="example@mail.ru"
                  className={m.field__input}
                />
              </div>
            </>
          ) : (
            <>
              <div className={m.field}>
                <label htmlFor="edit-company" className={m.field__label}>Название компании</label>
                <input
                  id="edit-company"
                  type="text"
                  value={corporate.companyName}
                  onChange={(e) => setCorporate(c => ({ ...c, companyName: e.target.value }))}
                  placeholder='ОАО "Компания"'
                  className={m.field__input}
                  autoFocus
                />
              </div>
              <div className={m.form__row}>
                <div className={m.field}>
                  <label htmlFor="edit-position" className={m.field__label}>Должность</label>
                  <input
                    id="edit-position"
                    type="text"
                    value={corporate.position}
                    onChange={(e) => setCorporate(c => ({ ...c, position: e.target.value }))}
                    placeholder="Должность"
                    className={`${m.field__input} ${m.field__input__small}`}
                  />
                </div>
                <div className={m.field} style={{ maxWidth: 180 }}>
                  <label htmlFor="edit-inn" className={m.field__label}>ИНН</label>
                  <input
                    id="edit-inn"
                    type="text"
                    inputMode="numeric"
                    value={corporate.inn}
                    onChange={(e) => setCorporate(c => ({ ...c, inn: e.target.value }))}
                    placeholder="999999999999"
                    className={`${m.field__input} ${m.field__input__small}`}
                  />
                </div>
              </div>
            </>
          )}

          {error && (
            <p style={{ color: "red", fontSize: 13, margin: "4px 0 0" }}>{error}</p>
          )}

          <button type="submit" className={m.btn__primary} disabled={isSubmitting}>
            {isSubmitting ? "СОХРАНЕНИЕ..." : "СОХРАНИТЬ ИЗМЕНЕНИЯ"}
          </button>
        </form>

      </div>
    </div>
  );
}