// pages/Publications/PublicationDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { PUBLICATIONS } from "./Publications";
import Sidebar from "../User/components/sidebar";
import layoutClasses from "../User/styles/layout.module.css";
import styles from "./PublicationDetail.module.scss";
import { FiChevronLeft, FiChevronRight, FiExternalLink } from "react-icons/fi";

export default function PublicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const pubId = Number(id);
  const pub = PUBLICATIONS.find((p) => p.id === pubId);

  if (!pub) {
    return (
      <>
        <Sidebar />
        <div className={layoutClasses.wrapper}>
          <div className={layoutClasses.main__area}>
            <p>Публикация не найдена.</p>
          </div>
        </div>
      </>
    );
  }

  const prevPub = PUBLICATIONS.find((p) => p.id === pubId - 1);
  const nextPub = PUBLICATIONS.find((p) => p.id === pubId + 1);
  const paragraphs = pub.content.split("\n\n").filter(Boolean);

  return (
    <>
      <Sidebar />
      <div className={layoutClasses.wrapper}>
        <div className={layoutClasses.main__area}>
          <div className={styles.content}>

            {/* Хлебные крошки */}
            <button className={styles.backBtn} onClick={() => navigate("/publications")}>
              <FiChevronLeft size={16} />
              Вернуться к Публикациям
            </button>

            <p className={styles.sectionLabel}>Статья проекта «Brassbook»</p>

            {/* Hero */}
            <div className={styles.hero}>
              <div className={styles.heroImage}>
                <img src={pub.imageUrl} alt={pub.title} />
              </div>
              <div className={styles.heroMeta}>
                <span className={styles.heroTag}>{pub.tag}</span>
                <h1 className={styles.heroTitle}>{pub.title}</h1>
                <p className={styles.heroSubtitle}>{pub.subtitle}</p>
                {pub.externalUrl && (
                  <a
                    href={pub.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.externalLink}
                  >
                    Перейти к статье <FiExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* Текст статьи */}
            <article className={styles.article}>
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </article>

            {/* Навигация между статьями */}
            <div className={styles.navRow}>
              {prevPub ? (
                <button
                  className={styles.navBtn}
                  onClick={() => navigate(`/publications/${prevPub.id}`)}
                >
                  <FiChevronLeft size={16} />
                  К другим статьям
                </button>
              ) : (
                <div />
              )}
              {nextPub && (
                <button
                  className={styles.navBtnRight}
                  onClick={() => navigate(`/publications/${nextPub.id}`)}
                >
                  Следующая статья
                  <FiChevronRight size={16} />
                </button>
              )}
            </div>

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
