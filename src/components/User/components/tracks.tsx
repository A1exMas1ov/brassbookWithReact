// components/Tracks/Tracks.tsx
import { useId, useMemo, useState } from "react";
import tracksClasses from "../styles/tracks.module.css";
import CreateAlbumModal from "../../UserModals/CreateAlbumModal";
import EditAlbumModal from "../../UserModals/EditAlbumModal";

const PLACEHOLDER_GRADIENT = [
  "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
  "linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)",
  "linear-gradient(135deg, #6ee7b7 0%, #059669 100%)",
];

type SortOption = "alphabet" | "date";

type Album = {
  id: string;
  title: string;
  count: string;
  bg: string; // CSS background value (url() или gradient-заглушка)
};

const ALBUMS: Album[] = [
  {
    id: "long",
    title: "Длинное название для теста. Нужно проверить как помещаются 50 символов.",
    count: "17 композиций",
    bg: PLACEHOLDER_GRADIENT[0],
  },
  {
    id: "short",
    title: "Короткое название",
    count: "231 композиция",
    bg: PLACEHOLDER_GRADIENT[1],
  },
  {
    id: "name",
    title: "Название",
    count: "5 композиций",
    bg: PLACEHOLDER_GRADIENT[2],
  },
];

function EditIcon() {
  return (
    <svg
      className={tracksClasses.album__edit__icon}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.333 13.333 2 14l.667-3.333L11.333 2Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className={tracksClasses.search__icon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="m16.5 16.5 3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Tracks() {
  const searchId = useId();
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("alphabet");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  const filteredAlbums = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    let result = [...ALBUMS];
    if (q) {
      result = result.filter((a) =>
        `${a.title} ${a.count}`.toLowerCase().includes(q)
      );
    }
    if (sortBy === "alphabet") {
      result.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    }
    return result;
  }, [searchValue, sortBy]);

  return (
    <>
    <div className={tracksClasses.tracks}>

      {/* ── Быстрые коллекции ── */}
      <div className={tracksClasses.collections}>
        {/* Избранное */}
        <article
          className={tracksClasses.collection__card}
          aria-label="Избранное, 23 композиции"
        >
          <div className={tracksClasses.collection__info}>
            <h2 className={tracksClasses.collection__title}>
              Избранное
            </h2>
            <p className={tracksClasses.collection__count}>23 композиции</p>
          </div>
          {/*
            Заменить src на реальное изображение:
            <img src={favoriteCover} ... />
          */}
          <div
            style={{
              width: 174,
              height: "100%",
              background: "linear-gradient(135deg, #fda4af 0%, #f43f5e 100%)",
              borderRadius: "0 20px 20px 0",
            }}
            aria-hidden="true"
          />
        </article>

        {/* Мои записи */}
        <article
          className={tracksClasses.collection__card}
          aria-label="Мои записи, 5 композиций"
        >
          <div className={tracksClasses.collection__info}>
            <h2 className={tracksClasses.collection__title}>
              Мои записи
            </h2>
            <p className={tracksClasses.collection__count}>5 композиций</p>
          </div>
          <div
            style={{
              width: 174,
              height: "100%",
              background: "linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)",
              borderRadius: "0 20px 20px 0",
            }}
            aria-hidden="true"
          />
        </article>
      </div>

      {/* ── Секция альбомов ── */}
      <section
        className={tracksClasses.albums__section}
        aria-labelledby="albums-heading"
      >
        <h2 id="albums-heading" className={tracksClasses.albums__title}>
          Альбомы
        </h2>

        {/* Описание */}
        <div className={tracksClasses.albums__description}>
          <p>
            Создавай альбомы по тематикам и сохраняй в них свою любимые
            композиции!
          </p>
          <p>
            Чтобы добавить композицию в альбом, нажми на{" "}
            <strong>+</strong>, а затем выбери нужный альбом из списка.
          </p>
        </div>

        {/* Поиск */}
        <div className={tracksClasses.search__bar}>
          <SearchIcon />
          <label htmlFor={searchId} className="sr-only">
            Найти композицию в альбомах
          </label>
          <input
            id={searchId}
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Найти композицию в альбомах"
            className={tracksClasses.search__input}
          />
        </div>

        {/* Сортировка */}
        <div
          className={tracksClasses.sort__bar}
          role="tablist"
          aria-label="Сортировка альбомов"
        >
          <button
            type="button"
            role="tab"
            aria-selected={sortBy === "alphabet"}
            onClick={() => setSortBy("alphabet")}
            className={
              tracksClasses.sort__btn +
              (sortBy === "alphabet" ? " " + tracksClasses["sort__btn--active"] : "")
            }
          >
            <span className={tracksClasses.sort__btn__icon}>АЯ</span>
            по алфавиту
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={sortBy === "date"}
            onClick={() => setSortBy("date")}
            className={
              tracksClasses.sort__btn +
              (sortBy === "date" ? " " + tracksClasses["sort__btn--active"] : "")
            }
          >
            📅 по дате добавления
          </button>
        </div>

        {/* Сетка альбомов */}
        <div className={tracksClasses.albums__grid}>
          {filteredAlbums.map((album) => (
            <article key={album.id} className={tracksClasses.album__card}>
              <div
                className={tracksClasses.album__cover}
                style={{ background: album.bg }}
              >
                <button
                  type="button"
                  className={tracksClasses.album__edit__btn}
                  aria-label={`Редактировать альбом ${album.title}`}
                  onClick={() => setEditingAlbum(album)}
                >
                  <EditIcon />
                  Редактировать
                </button>
              </div>
              <div>
                <p className={tracksClasses.album__name}>{album.title}</p>
                <p className={tracksClasses.album__count}>{album.count}</p>
              </div>
            </article>
          ))}

          {/* Создать альбом */}
          <div>
            <button
              type="button"
              className={tracksClasses.album__create}
              aria-label="Создать альбом"
              onClick={() => setShowCreateModal(true)}
            >
              <span className={tracksClasses.album__create__plus} aria-hidden="true" />
              Создать альбом
            </button>
          </div>
        </div>
      </section>
    </div>

      {/* ── Модальные окна ── */}
      {showCreateModal && (
        <CreateAlbumModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(name, cover) => {
            console.log("Создан альбом:", name, cover);
          }}
        />
      )}
      {editingAlbum && (
        <EditAlbumModal
          albumTitle={editingAlbum.title}
          albumCover={null}
          onClose={() => setEditingAlbum(null)}
          onSaved={(name, cover) => {
            console.log("Сохранён альбом:", name, cover);
          }}
          onDeleted={() => {
            console.log("Удалён альбом:", editingAlbum.id);
          }}
        />
      )}
    </>
  );
}

export default Tracks;
