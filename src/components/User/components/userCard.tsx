// components/UserCard/UserCard.tsx
import cardClasses from "../styles/userCard.module.css";
import IconArrow from "../../../assets/icons/IconArrow";
import userCardAngle from "../../../assets/img/user_card_angle.png";

// Данные профиля — в реальном приложении придут из props / store
const profileFields = [
  { label: "Имя",     value: "Иван"            },
  { label: "Фамилия", value: "Иванов"          },
  { label: "Почта",   value: "pelamore@mail.ru" },
];

function UserCard() {
  return (
    <div className={cardClasses.card__content}>
      {/* Декоративная картинка в правом верхнем углу */}
      <img
        src={userCardAngle}
        className={cardClasses.card__decoration}
        alt=""
        aria-hidden="true"
      />

      <div className={cardClasses.card__inner}>

        {/* ── Фото ── */}
        <div className={cardClasses.card__photo}>
          {/*
            Здесь будет <img src={avatarUrl} alt="Фото профиля" ... />
            Пока блок остаётся пустым — заменяется при подключении данных пользователя.
          */}
        </div>

        {/* ── Информация ── */}
        <div className={cardClasses.card__info}>

          <div className={cardClasses.card__info__main}>

            {/* Имя / Фамилия / Почта */}
            <div className={cardClasses.card__info__name}>
              {profileFields.map((field) => (
                <div key={field.label} className={cardClasses.profile__field}>
                  <p className={cardClasses.profile__label}>{field.label}</p>
                  <p className={cardClasses.profile__value}>{field.value}</p>
                </div>
              ))}
            </div>

            {/* Подсказки — куда попадают отмеченные/записанные треки */}
            <div className={cardClasses.card__info__extra}>
              <div className={cardClasses.extra__line}>
                <span className={cardClasses.extra__text}>
                  Композиции, отмеченные тобою
                </span>
                <span
                  className={cardClasses.extra__icon + " " + cardClasses["extra__icon--heart"]}
                  aria-hidden="true"
                />
                <span className={cardClasses.extra__text}>
                  , находятся в{" "}
                  <span className={cardClasses["extra__text--accent"]}>Избранном</span>.
                </span>
              </div>
              <div className={cardClasses.extra__line}>
                <span className={cardClasses.extra__text}>
                  Записи с помощью Диктофона и загруженные треки — в разделе{" "}
                  <span className={cardClasses["extra__text--accent"]}>Мои Записи</span>.
                </span>
              </div>
            </div>

          </div>

          {/* Кнопки редактирования */}
          <div className={cardClasses.card__buttons}>
            <button className={cardClasses.button__edit__data}>
              Редактировать личные данные <IconArrow />
            </button>
            <button className={cardClasses.button__edit__data}>
              Изменить пароль <IconArrow />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserCard;