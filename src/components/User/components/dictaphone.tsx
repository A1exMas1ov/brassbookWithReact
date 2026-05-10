import classes from "../styles/dictaphone.module.css";
import dictaphoneImg from "../../../assets/img/dictaphoneImg.png";

function Dictaphone() {
  return (
    <div className={classes.record}>
        <img src={dictaphoneImg} className={classes.record__bg} alt="" />
        <div className={classes.record__overlay} aria-hidden="true" />

      <div className={classes.record__content}>
        <h2 className={classes.record__title}>ДИКТОФОН</h2>
        <p className={classes.record__description}>
          Ты можешь записать свою игру на инструменте и, если захочешь,
          она будет проанализирована на ошибки.
        </p>
      </div>

      <button type="button" className={classes.record__button}>
        ЗАПИСАТЬ ПРОИЗВЕДЕНИЕ
      </button>
    </div>
  );
}

export default Dictaphone;
