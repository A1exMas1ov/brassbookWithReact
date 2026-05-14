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
      <path
        d="M8.42333 0C7.3675 0 6.4225 0.513333 5.83333 1.30083C5.24417 0.513333 4.29917 0 3.24333 0C1.4525 0 0 1.45833 0 3.26083C0 3.955 0.110833 4.59667 0.303333 5.19167C1.225 8.10833 4.06583 9.8525 5.47167 10.3308C5.67 10.4008 5.99667 10.4008 6.195 10.3308C7.60083 9.8525 10.4417 8.10833 11.3633 5.19167C11.5558 4.59667 11.6667 3.955 11.6667 3.26083C11.6667 1.45833 10.2142 0 8.42333 0Z"
        fill="#F70A51"
      />
    </svg>
  );
}

function IconDictaphone() {
  return (
    <span className={cardClasses.extra__icon__dictaphone__wrapper}>
      <img
        src={dictaphoneImg}
        alt=""
        className={cardClasses.extra__icon__dictaphone__img}
      />
      <div className={cardClasses.extra__icon__dictaphone__overlay} aria-hidden="true" />
    </span>
  );
}

function IconGalleryAdd() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M27.96 1.33334H24.04C22.88 1.33334 22.0267 1.81334 21.64 2.66668C21.4267 3.05334 21.3334 3.50668 21.3334 4.04001V7.96001C21.3334 9.65334 22.3467 10.6667 24.04 10.6667H27.96C28.4934 10.6667 28.9467 10.5733 29.3334 10.36C30.1867 9.97334 30.6667 9.12001 30.6667 7.96001V4.04001C30.6667 2.34668 29.6534 1.33334 27.96 1.33334ZM29.2134 6.57334C29.08 6.70668 28.88 6.80001 28.6667 6.81334H26.7867V7.49334L26.8 8.66668C26.7867 8.89334 26.7067 9.08001 26.5467 9.24001C26.4134 9.37334 26.2134 9.46668 26 9.46668C25.56 9.46668 25.2 9.10668 25.2 8.66668V6.80001L23.3334 6.81334C22.8934 6.81334 22.5334 6.44001 22.5334 6.00001C22.5334 5.56001 22.8934 5.20001 23.3334 5.20001L24.5067 5.21334H25.2V3.34668C25.2 2.90668 25.56 2.53334 26 2.53334C26.44 2.53334 26.8 2.90668 26.8 3.34668L26.7867 4.29334V5.20001H28.6667C29.1067 5.20001 29.4667 5.56001 29.4667 6.00001C29.4534 6.22668 29.36 6.41334 29.2134 6.57334Z" fill="#230B3F" fill-opacity="0.3"/>
      <path d="M12 13.84C13.7526 13.84 15.1733 12.4193 15.1733 10.6667C15.1733 8.9141 13.7526 7.49335 12 7.49335C10.2474 7.49335 8.82666 8.9141 8.82666 10.6667C8.82666 12.4193 10.2474 13.84 12 13.84Z" fill="#230B3F" fill-opacity="0.3"/>
      <path d="M27.96 10.6667H27.3333V16.8133L27.16 16.6667C26.12 15.7733 24.44 15.7733 23.4 16.6667L17.8533 21.4267C16.8133 22.32 15.1333 22.32 14.0933 21.4267L13.64 21.0533C12.6933 20.2267 11.1866 20.1467 10.12 20.8667L5.13329 24.2133C4.83996 23.4667 4.66663 22.6 4.66663 21.5867V10.4133C4.66663 6.65332 6.65329 4.66666 10.4133 4.66666H21.3333V4.03999C21.3333 3.50666 21.4266 3.05332 21.64 2.66666H10.4133C5.55996 2.66666 2.66663 5.55999 2.66663 10.4133V21.5867C2.66663 23.04 2.91996 24.3067 3.41329 25.3733C4.55996 27.9067 7.01329 29.3333 10.4133 29.3333H21.5866C26.44 29.3333 29.3333 26.44 29.3333 21.5867V10.36C28.9466 10.5733 28.4933 10.6667 27.96 10.6667Z" fill="#230B3F" fill-opacity="0.3"/>
    </svg>
  );
}

function IconGalleryEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.98 0.666672H12.02C11.1733 0.666672 10.6666 1.17334 10.6666 2.02001V3.98001C10.6666 4.82667 11.1733 5.33334 12.02 5.33334H13.98C14.8266 5.33334 15.3333 4.82667 15.3333 3.98001V2.02001C15.3333 1.17334 14.8266 0.666672 13.98 0.666672ZM12.6733 4.38001C12.6533 4.40001 12.6066 4.42667 12.5733 4.42667L11.88 4.52667C11.86 4.53334 11.8333 4.53334 11.8133 4.53334C11.7133 4.53334 11.6266 4.50001 11.5666 4.43334C11.4866 4.35334 11.4533 4.24001 11.4733 4.12001L11.5733 3.42667C11.58 3.39334 11.6 3.34667 11.62 3.32667L12.7533 2.19334C12.7733 2.24001 12.7933 2.29334 12.8133 2.34667C12.84 2.40001 12.8666 2.44667 12.8933 2.49334C12.9133 2.53334 12.94 2.57334 12.9666 2.60001C12.9933 2.64001 13.02 2.68001 13.04 2.70001C13.0533 2.72001 13.06 2.72667 13.0666 2.73334C13.1266 2.80667 13.1933 2.87334 13.2533 2.92001C13.2666 2.93334 13.28 2.94667 13.2866 2.94667C13.32 2.97334 13.36 3.00667 13.3866 3.02667C13.4266 3.05334 13.46 3.08001 13.5 3.10001C13.5466 3.12667 13.6 3.15334 13.6533 3.18001C13.7066 3.20667 13.76 3.22667 13.8066 3.24001L12.6733 4.38001ZM14.2666 2.78667L14.0533 3.00001C14.04 3.02001 14.02 3.02667 14 3.02667C13.9933 3.02667 13.9866 3.02667 13.98 3.02667C13.5 2.88667 13.12 2.50667 12.98 2.02667C12.9733 2.00001 12.98 1.97334 13 1.95334L13.22 1.73334C13.58 1.37334 13.92 1.38001 14.2733 1.73334C14.4533 1.91334 14.54 2.08667 14.54 2.26001C14.5333 2.43334 14.4466 2.60667 14.2666 2.78667Z" fill="white"/>
      <path d="M6 6.92001C6.87629 6.92001 7.58666 6.20963 7.58666 5.33334C7.58666 4.45705 6.87629 3.74667 6 3.74667C5.12371 3.74667 4.41333 4.45705 4.41333 5.33334C4.41333 6.20963 5.12371 6.92001 6 6.92001Z" fill="white"/>
      <path d="M13.98 5.33333H13.6667V8.40666L13.58 8.33333C13.06 7.88666 12.22 7.88666 11.7 8.33333L8.92671 10.7133C8.40671 11.16 7.56671 11.16 7.04671 10.7133L6.82004 10.5267C6.34671 10.1133 5.59337 10.0733 5.06004 10.4333L2.56671 12.1067C2.42004 11.7333 2.33337 11.3 2.33337 10.7933V5.20666C2.33337 3.32666 3.32671 2.33333 5.20671 2.33333H10.6667V2.01999C10.6667 1.75333 10.7134 1.52666 10.82 1.33333H5.20671C2.78004 1.33333 1.33337 2.77999 1.33337 5.20666V10.7933C1.33337 11.52 1.46004 12.1533 1.70671 12.6867C2.28004 13.9533 3.50671 14.6667 5.20671 14.6667H10.7934C13.22 14.6667 14.6667 13.22 14.6667 10.7933V5.17999C14.4734 5.28666 14.2467 5.33333 13.98 5.33333Z" fill="white"/>
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
        // ── Фото загружено:
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
        // ── Фото нет:
        <div
          className={cardClasses.card__photo__placeholder}
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleClick()
          }
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

// ── Hint-блок (только для личного аккаунта)

function HintBlock() {
  return (
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
        <span
          className={cardClasses.extra__text}
          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          <IconDictaphone />
          <span className={cardClasses["extra__text--accent"]}>Диктофона</span>
        </span>
        <span className={cardClasses.extra__text}>
          {" "}
          и загруженные треки находятся в разделе{" "}
          <span className={cardClasses["extra__text--default"]}>Мои Записи</span>.
        </span>
      </div>
    </div>
  );
}

// ── Основной компонент

function UserCard() {
  const { profileStore } = useContext(Context);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    profileStore.fetchProfile();
  }, []);

  const user = profileStore.user;
  const isCompany = user.role === "ROLE_COMPANY";

  const personalFields = [
    { label: "Имя", value: user.displayName || "Не заполнено" },
    { label: "Фамилия", value: user.displaySurname || "Не заполнено" },
    { label: "Почта", value: user.email || "Не заполнено" },
  ];

  const corporateMainFields = [
    { label: "Имя", value: user.displayName || "Не заполнено" },
    { label: "Фамилия", value: user.displaySurname || "Не заполнено" },
    { label: "Почта", value: user.email || "Не заполнено" },
  ];

  const handlePhotoSelect = async (file: File) => {
    try {
      await profileStore.uploadPhoto(file);
    } catch {
      // ошибка в сторе
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
              // КОРПОРАТИВНЫЙ АККАУНТ
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

                {/* Компания + Должность + ИНН */}
                <div className={cardClasses.card__info__corporate}>
                  <div
                    className={`${cardClasses.card__info__corporate__field} ${cardClasses["card__info__corporate__field--company"]}`}
                  >
                    <p className={cardClasses.corporate__label}>Название компании</p>
                    <p className={cardClasses.corporate__value}>
                      {user.companyName || "Не заполнено"}
                    </p>
                  </div>
                  <div
                    className={`${cardClasses.card__info__corporate__field} ${cardClasses["card__info__corporate__field--position"]}`}
                  >
                    <p className={cardClasses.corporate__label}>Должность</p>
                    <p className={cardClasses.corporate__value}>
                      {user.profession || "Не заполнено"}
                    </p>
                  </div>
                  <div
                    className={`${cardClasses.card__info__corporate__field} ${cardClasses["card__info__corporate__field--inn"]}`}
                  >
                    <p className={cardClasses.corporate__label}>ИНН</p>
                    <p className={cardClasses.corporate__value}>
                      {user.inn?.toString() || "Не заполнено"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              // ЛИЧНЫЙ АККАУНТ
              <div className={cardClasses.card__info__name}>
                {personalFields.map((field) => (
                  <div key={field.label} className={cardClasses.profile__field}>
                    <p className={cardClasses.profile__label}>{field.label}</p>
                    <p className={cardClasses.profile__value}>{field.value}</p>
                  </div>
                ))}
              </div>
            )}

            {!isCompany && <HintBlock />}
          </div>

          {/* Кнопки*/}
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
            firstName: user.displayName || "",
            lastName: user.displaySurname || "",
            email: user.email || "",
          }}
          initialCorporate={{
            companyName: user.companyName || "",
            position: user.profession || "",
            inn: user.inn?.toString() || "",
          }}
          onSave={async (personal, corporate) => {
            await profileStore.updateProfile({
              displayName: personal.firstName,
              displaySurname: personal.lastName,
              email: personal.email,
              companyName: corporate.companyName,
              profession: corporate.position,
              inn: Number(corporate.inn) || undefined,
            });
          }}
        />
      )}
    </div>
  );
}

export default observer(UserCard);