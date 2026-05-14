// components/UserCard/UserCard.tsx
import { useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import cardClasses from "../styles/userCard.module.css";
import IconArrow from "../../../assets/icons/IconArrow";
import userCardAngle from "../../../assets/img/user_card_angle.png";
import dictaphoneImg from "../../../assets/img/dictaphoneImg.png";
import { Context } from "../../../../Context/context";
import ChangePasswordModal from "../../UserModals/ChangePasswordModal";
import EditProfileModal from "../../UserModals/EditProfileModal";

// ── Иконки ──────────────────────────────────────────────────────────────────

function IconHeart() {
  return (
    <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
      <path d="M8.42333 0C7.3675 0 6.4225 0.513333 5.83333 1.30083C5.24417 0.513333 4.29917 0 3.24333 0C1.4525 0 0 1.45833 0 3.26083C0 3.955 0.110833 4.59667 0.303333 5.19167C1.225 8.10833 4.06583 9.8525 5.47167 10.3308C5.67 10.4008 5.99667 10.4008 6.195 10.3308C7.60083 9.8525 10.4417 8.10833 11.3633 5.19167C11.5558 4.59667 11.6667 3.955 11.6667 3.26083C11.6667 1.45833 10.2142 0 8.42333 0Z" fill="#F70A51"/>
    </svg>
  );
}

function IconDictaphone() {
  return (
    <span className={cardClasses.extra__icon__dictaphone__wrapper}>
      <img src={dictaphoneImg} alt="" className={cardClasses.extra__icon__dictaphone__img} />
      <div className={cardClasses.extra__icon__dictaphone__overlay} aria-hidden="true" />
    </span>
  );
}

// Иконка галереи (для заглушки фото)
function IconGalleryAdd() {
  return (
    <svg className={cardClasses.card__photo__placeholder__icon} viewBox="0 0 40 40" fill="none">
      <path d="M15 36.667H25c8.333 0 11.667-3.334 11.667-11.667V15c0-8.333-3.334-11.667-11.667-11.667H15C6.667 3.333 3.333 6.667 3.333 15v10c0 8.333 3.334 11.667 11.667 11.667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 16.667a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.45 31.583 12.667 25.8c1.35-.933 3.3-.833 4.5.233l.55.5c1.317 1.167 3.417 1.167 4.733 0l6.9-6.116c1.317-1.167 3.417-1.167 4.733 0l2.584 2.283" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Иконка редактирования фото
function IconGalleryEdit() {
  return (
    <svg className={cardClasses.card__photo__edit__icon} viewBox="0 0 16 16" fill="none">
      <path d="M6 1.333H6c-2.667 0-4 1.334-4 4v5.334c0 2.666 1.333 4 4 4h4c2.667 0 4-1.334 4-4V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.693 2.007 5.44 7.26c-.2.2-.4.593-.44.88l-.287 2.007c-.1.693.38 1.166 1.073 1.073l2.007-.287c.28-.04.68-.24.88-.44l5.253-5.253c.907-.907 1.34-1.96 0-3.3-1.34-1.333-2.387-.9-3.233-.053v.12Z" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Компонент фото-блока ────────────────────────────────────────────────────
interface PhotoBlockProps {
  photoUrl?: string | null;
  isUploading?: boolean;
  onFileSelect: (file: File) => void;
}

function PhotoBlock({ photoUrl, isUploading, onFileSelect }: PhotoBlockProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => fileInputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    // Сбрасываем input чтобы можно было выбрать тот же файл снова
    e.target.value = "";
  };

  return (
    <div className={cardClasses.card__photo}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={cardClasses.card__photo__input}
        onChange={handleChange}
        tabIndex={-1}
        aria-label="Выбрать фото профиля"
      />

      {photoUrl ? (
        // ── Фото загружено: показываем его + плашку «Изменить» снизу ──
        <>
          <img
            src={photoUrl}
            alt="Фото профиля"
            className={cardClasses.card__photo__img}
          />
          <button
            type="button"
            className={cardClasses.card__photo__edit}
            onClick={handleClick}
            aria-label="Изменить фотографию"
          >
            <IconGalleryEdit />
            {isUploading ? "Загрузка..." : "Изменить фотографию"}
          </button>
        </>
      ) : (
        // ── Фото нет: заглушка по центру, весь блок кликабелен ──
        <div
          className={cardClasses.card__photo__placeholder}
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
          aria-label="Нажми, чтобы выбрать личное фото"
        >
          <IconGalleryAdd />
          <span className={cardClasses.card__photo__placeholder__text}>
            {isUploading ? "Загрузка..." : "Нажми, чтобы выбрать личное фото"}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Основной компонент ───────────────────────────────────────────────────────
function UserCard() {
  const { profileStore } = useContext(Context);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showEditProfile, setShowEditProfile]         = useState(false);

  useEffect(() => {
    profileStore.fetchProfile();
  }, []);

  const user      = profileStore.user;
  const isCompany = user.role === "ROLE_COMPANY";

  // Поля для личного аккаунта
  const personalFields = [
    { label: "Имя",     value: user.displayName    || "Не заполнено" },
    { label: "Фамилия", value: user.displaySurname || "Не заполнено" },
    { label: "Почта",   value: user.email          || "Не заполнено" },
  ];

  // Основные поля для корпоративного (имя + фамилия + почта сверху)
  const corporateMainFields = [
    { label: "Имя",     value: user.displayName    || "Не заполнено" },
    { label: "Фамилия", value: user.displaySurname || "Не заполнено" },
    { label: "Почта",   value: user.email          || "Не заполнено" },
  ];

  const handlePhotoSelect = async (file: File) => {
    try {
      await profileStore.uploadPhoto(file);
    } catch {
      // ошибка уже в консоли через store
    }
  };

  return (
    <div className={cardClasses.card__content}>
      <img
        src={userCardAngle}
        className={cardClasses.card__decoration}
        alt=""
        aria-hidden="true"
      />

      <div className={cardClasses.card__inner}>

        {/* ── Блок фото ── */}
        <PhotoBlock
          photoUrl={user.photoUrl}
          isUploading={profileStore.isPhotoUploading}
          onFileSelect={handlePhotoSelect}
        />

        {/* ── Информация ── */}
        <div className={cardClasses.card__info}>
          <div className={cardClasses.card__info__main}>

            {isCompany ? (
              // ═══════════════════════════════════════════════════════════
              // КОРПОРАТИВНЫЙ АККАУНТ
              // ═══════════════════════════════════════════════════════════
              <>
                {/* Имя / Фамилия / Почта */}
                <div className={cardClasses.card__info__name}>
                  {corporateMainFields.map((field) => (
                    <div key={field.label} className={cardClasses.profile__field}>
                      <p className={cardClasses.profile__label}>{field.label}</p>
                      <p className={cardClasses.profile__value}>{field.value}</p>
                    </div>
                  ))}
                </div>

                {/* Компания + Должность + ИНН в строку */}
                <div className={cardClasses.card__info__corporate}>
                  <div className={`${cardClasses.card__info__corporate__field} ${cardClasses["card__info__corporate__field--company"]}`}>
                    <p className={cardClasses.corporate__label}>Название компании</p>
                    <p className={cardClasses.corporate__value}>{user.companyName || "Не заполнено"}</p>
                  </div>
                  <div className={`${cardClasses.card__info__corporate__field} ${cardClasses["card__info__corporate__field--position"]}`}>
                    <p className={cardClasses.corporate__label}>Должность</p>
                    <p className={cardClasses.corporate__value}>{user.profession || "Не заполнено"}</p>
                  </div>
                  <div className={`${cardClasses.card__info__corporate__field} ${cardClasses["card__info__corporate__field--inn"]}`}>
                    <p className={cardClasses.corporate__label}>ИНН</p>
                    <p className={cardClasses.corporate__value}>{user.inn?.toString() || "Не заполнено"}</p>
                  </div>
                </div>
              </>
            ) : (
              // ═══════════════════════════════════════════════════════════
              // ЛИЧНЫЙ АККАУНТ
              // ═══════════════════════════════════════════════════════════
              <div className={cardClasses.card__info__name}>
                {personalFields.map((field) => (
                  <div key={field.label} className={cardClasses.profile__field}>
                    <p className={cardClasses.profile__label}>{field.label}</p>
                    <p className={cardClasses.profile__value}>{field.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Hint-блок — одинаков для обоих типов */}
            <div className={cardClasses.card__info__extra}>
              <div className={cardClasses.extra__line}>
                <span className={cardClasses.extra__text}>
                  Композиции, отмеченные тобою
                </span>
                <span className={cardClasses.extra__icon} aria-hidden="true">
                  <IconHeart />
                </span>
                <span className={cardClasses.extra__text}>
                  , находятся в{" "}
                  <span className={cardClasses["extra__text--default"]}>Избранном</span>.
                </span>
              </div>
              <div className={cardClasses.extra__line}>
                <span className={cardClasses.extra__text}>
                  Записи, которые ты делал с помощью
                </span>
                <span className={cardClasses.extra__text} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <IconDictaphone />
                  <span className={cardClasses["extra__text--accent"]}>Диктофона</span>
                </span>
                <span className={cardClasses.extra__text}>
                  {" "}и загруженные треки находятся в разделе{" "}
                  <span className={cardClasses["extra__text--default"]}>Мои Записи</span>.
                </span>
              </div>
            </div>

          </div>

          {/* Кнопки */}
          <div className={cardClasses.card__buttons}>
            <button
              className={cardClasses.button__edit__data}
              onClick={() => setShowEditProfile(true)}
            >
              Редактировать личные данные <IconArrow />
            </button>
            <button
              className={cardClasses.button__edit__data}
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Изменить пароль <IconArrow />
            </button>
          </div>

        </div>
      </div>

      {/* ── Модальные окна ── */}
      {isPasswordModalOpen && (
        <ChangePasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
          onSave={(cur, next) => profileStore.changePassword(cur, next)}
        />
      )}

      {showEditProfile && (
        <EditProfileModal
          onClose={() => setShowEditProfile(false)}
          initialPersonal={{
            firstName: user.displayName    || "",
            lastName:  user.displaySurname || "",
            email:     user.email          || "",
          }}
          initialCorporate={{
            companyName: user.companyName     || "",
            position:    user.profession      || "",
            inn:         user.inn?.toString() || "",
          }}
          onSave={async (personal, corporate) => {
            await profileStore.updateProfile({
              displayName:    personal.firstName,
              displaySurname: personal.lastName,
              email:          personal.email,
              // corporate поля — раскомментируй когда напарник добавит в PUT /profile:
              companyName: corporate.companyName,
              profession:  corporate.position,
              inn:         Number(corporate.inn) || undefined,
            });
          }}
        />
      )}
    </div>
  );
}

export default observer(UserCard);