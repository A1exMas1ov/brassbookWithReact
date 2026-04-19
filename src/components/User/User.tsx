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
            <div className={classes.card__content}></div>
            <div className={classes.tracks}></div>
          </div>
          <div className={classes.right__column}>
            <div className={classes.record}></div>
            <div className={classes.player}></div>
          </div>
        </div>
        <footer className={classes.footer}></footer>
      </div>
    </>
  );
}

export default User;
