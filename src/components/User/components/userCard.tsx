// components/UserCard/UserCard.tsx
import cardClasses from "../styles/userCard.module.css";
import IconArrow from "../../../assets/icons/IconArrow";
import userCardAngle from "../../../assets/img/user_card_angle.png";
import dictaphoneImg from "../../../assets/img/dictaphoneImg.png";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../../../Context/context";
import ChangePasswordModal from "../../UserModals/ChangePasswordModal";
import EditProfileModal from "../../UserModals/EditProfileModal";

function IconHeart() {
  return (
    <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function UserCard() {
  const { profileStore } = useContext(Context);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    profileStore.fetchProfile();
  }, []);

  const user = profileStore.user;
  const isCompany = user.role === "ROLE_COMPANY";

  const profileFields = isCompany
    ? [
        { label: "Компания",  value: user.companyName        || "Не заполнено" },
        { label: "Должность", value: user.profession         || "Не заполнено" },
        { label: "ИНН",       value: user.inn?.toString()    || "Не заполнено" },
        { label: "Почта",     value: user.email              || "Не заполнено" },
      ]
    : [
        { label: "Имя",       value: user.displayName        || "Не заполнено" },
        { label: "Фамилия",   value: user.displaySurname     || "Не заполнено" },
        { label: "Почта",     value: user.email              || "Не заполнено" },
      ];

  return (
    <div className={cardClasses.card__content}>
      <img
        src={userCardAngle}
        className={cardClasses.card__decoration}
        alt=""
        aria-hidden="true"
      />

      <div className={cardClasses.card__inner}>

        <div className={cardClasses.card__photo}>
          {user.photoUrl && (
            <img src={user.photoUrl} alt="Фото профиля" className={cardClasses.card__photo__img} />
          )}
        </div>

        <div className={cardClasses.card__info}>

          <div className={cardClasses.card__info__main}>

            <div className={cardClasses.card__info__name}>
              {profileFields.map((field) => (
                <div key={field.label} className={cardClasses.profile__field}>
                  <p className={cardClasses.profile__label}>{field.label}</p>
                  <p className={cardClasses.profile__value}>{field.value}</p>
                </div>
              ))}
            </div>

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
            companyName: user.companyName      || "",
            position:    user.profession       || "",
            inn:         user.inn?.toString()  || "",
          }}
          onSave={async (personal, corporate) => {
            await profileStore.updateProfile({
              displayName:    personal.firstName,
              displaySurname: personal.lastName,
              email:          personal.email,
              // corporate поля — когда напарник добавит в PUT /profile
            });
          }}
        />
      )}
    </div>
  );
}

export default observer(UserCard);