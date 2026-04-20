import { NavLink } from "react-router-dom";
import classes from "./user.module.css";
import Logo from "./Logo";
import IconProfile from "./IconProfile";
import IconTracks from "./IconTracks";
import IconLibrary from "./IconLibrary";
import IconPublications from "./IconPublications";
import IconExit from "./IconExit";
import IconArrow from "./IconArrow";
import IconHeart from "./IconHeart";

function User() {
  return (
    <>
      <div className={classes.div__menu}>
        <div className={classes.menu__inner}>
          <div className={classes.nav__block}>

            <Logo />

            <div className={classes.nav__section}>
              <p className={classes.signin__backlink}>МЕНЮ</p>
              <ul className={classes.ul__menu1}>
                <NavLink 
                    to="/user" 
                    className={({ isActive }) => isActive ? classes.activeLink : undefined}
                  >
                <IconProfile /> Личный кабинет
                </NavLink>
                <a href=""><IconTracks /> Произведения</a>
                <a href=""><IconLibrary /> Библиотека</a>
                <a href=""><IconPublications /> Публикации</a>
              </ul>
            </div>

            <div className={classes.nav__section}>
              <p className={classes.signin__backlink}>МОИ АЛЬБОМЫ</p>
              <ul className={classes.ul__menu2}>
                <a href=""><IconHeart />Избранное</a>
                <a href="">Мои записи</a>
                <a href="">Название</a>
                <a href="">Короткое название</a>
                <a href="">Длинное название</a>
              </ul>
              <button className={classes.button__all}>
                Посмотреть все <IconArrow />
              </button>             
            </div>

          </div>

        <NavLink to="/signin" className={classes.a__exit}>
          <IconExit /> Выход
        </NavLink>
        </div>
      </div>

      <div className={classes.wrapper}>
        <div className={classes.main__area}>
          <div className={classes.left__column}>
            <div className={classes.card__content}>
              <img src=".\src\assets\img\user_card_angle.png" className={classes.card__decoration} alt="" />
                <div className={classes.card__inner}>
                  <div className={classes.card__photo}></div>
                  <div className={classes.card__info}>
                    <div className={classes.card__info__main}>
                        <div className={classes.card__info__name}></div>
                        <div className={classes.card__info__extra}></div>
                    </div>
                    <div className={classes.card__buttons}>
                      <button className={classes.button__edit__data}>Редактировать личные данные <IconArrow /></button>
                      <button className={classes.button__edit__data}>Изменить пароль<IconArrow /></button>
                    </div>
                  </div>
                </div>
            </div>
            <div className={classes.tracks}></div>
          </div>
          <div className={classes.right__column}>
            <div className={classes.record}></div>
            <div className={classes.player}></div>
          </div>
        </div>
        <footer className={classes.footer}>
          <span className={classes.footer__logo}>BrassBook</span>
          <span className={classes.footer__copy}>©2019-2024, Brassbook.Все права защищены</span>
        </footer>
      </div>
    </>
  );
}

export default User;
