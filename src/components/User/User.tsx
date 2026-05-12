// pages/User/User.tsx
import layoutClasses from "./styles/layout.module.css";
import Sidebar from "./components/sidebar";
import UserCard from "./components/userCard";
import Tracks from "./components/tracks";
import Dictaphone from "./components/dictaphone";
import MusicPlayer from "./components/musicPlayer";

function User() {
  return (
    <>
      <Sidebar />
      <div className={layoutClasses.wrapper}>
        <div className={layoutClasses.main__area}>
          <div className={layoutClasses.left__column}>
            <UserCard />
            <Tracks />
          </div>
          <div className={layoutClasses.right__column}>
            <Dictaphone />
            <MusicPlayer />
          </div>
        </div>
        <footer className={layoutClasses.footer}>
          <span className={layoutClasses.footer__logo}>BrassBook</span>
          <span className={layoutClasses.footer__copy}>
            ©2019-2024, Brassbook. Все права защищены
          </span>
        </footer>
      </div>
    </>
  );
}

export default User;
