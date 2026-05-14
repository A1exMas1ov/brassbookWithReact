// components/Tracks/Tracks.tsx
import { useContext, useEffect, useId, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import tracksClasses from "../styles/tracks.module.css";
import CreateAlbumModal from "../../UserModals/CreateAlbumModal";
import EditAlbumModal from "../../UserModals/EditAlbumModal";
import { Context } from "../../../../Context/context";
import { IAlbum } from "../../../../models/response/IAlbum";

type SortOption = "alphabet" | "date";

function EditIcon() {
  return (
    <svg className={tracksClasses.album__edit__icon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.333 13.333 2 14l.667-3.333L11.333 2Z"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.79 21.76L22.07 21.04C22.44 20.48 22.66 19.8 22.66 19.08C22.66 17.1 21.06 15.5 19.08 15.5C17.1 15.5 15.5 17.1 15.5 19.08C15.5 21.06 17.1 22.66 19.08 22.66C19.81 22.66 20.48 22.44 21.04 22.07L21.76 22.79C21.9 22.93 22.09 23 22.27 23C22.46 23 22.64 22.93 22.78 22.79C23.07 22.5 23.07 22.04 22.79 21.76Z" fill="#230B3F" fill-opacity="0.3"/>
      <path d="M12.2302 12.07C11.8202 12.07 11.4902 12.4 11.4902 12.81C11.4902 13.22 11.8202 13.55 12.2302 13.55C12.6402 13.55 12.9702 13.22 12.9702 12.81C12.9702 12.4 12.6402 12.07 12.2302 12.07Z" fill="#230B3F" fill-opacity="0.3"/>
      <path d="M6.76002 13.06C6.35002 13.06 6.02002 13.39 6.02002 13.8C6.02002 14.21 6.35002 14.54 6.76002 14.54C7.17002 14.54 7.50002 14.21 7.50002 13.8C7.50002 13.39 7.17002 13.06 6.76002 13.06Z" fill="#230B3F" fill-opacity="0.3"/>
      <path d="M16.19 2H7.81C7.53 2 7.26 2.01 7 2.05C3.85 2.34 2 4.45 2 7.81V16.19C2 19.55 3.85 21.66 7 21.95C7.26 21.99 7.53 22 7.81 22H13.5C13.89 22 14.14 21.56 13.99 21.2C13.7 20.51 13.5 19.71 13.5 19C13.5 15.97 15.97 13.5 19 13.5C19.76 13.5 20.5 13.65 21.18 13.95C21.55 14.11 22 13.86 22 13.46V7.81C22 4.17 19.83 2 16.19 2ZM14.48 8.05V12.81C14.48 12.82 14.47 12.83 14.47 12.85C14.45 14.07 13.46 15.06 12.23 15.06C10.99 15.06 9.99 14.05 9.99 12.82C9.99 11.58 11 10.58 12.23 10.58C12.49 10.58 12.74 10.63 12.98 10.72V9.03L9.01 10.11V13.81C9.01 13.82 9 13.83 9 13.84C8.98 15.06 7.99 16.04 6.76 16.04C5.52 16.04 4.52 15.03 4.52 13.8C4.52 12.57 5.53 11.56 6.76 11.56C7.02 11.56 7.27 11.61 7.5 11.7V9.54V7.79C7.5 6.86 8.08 6.11 8.97 5.87L11.95 5.05C12.88 4.8 13.45 5.05 13.77 5.29C14.23 5.64 14.46 6.21 14.46 6.97V8.05H14.48Z" fill="#230B3F" fill-opacity="0.3"/>
    </svg>
  );
}

const Tracks = observer(function Tracks() {
  const searchId = useId();
  const { albumStore } = useContext(Context);

  const [searchValue, setSearchValue]     = useState("");
  const [sortBy, setSortBy]               = useState<SortOption>("date");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlbum, setEditingAlbum]   = useState<IAlbum | null>(null);

  useEffect(() => {
    albumStore.loadAlbums(0, "createdAt");
    albumStore.loadFavorites(0);
    albumStore.loadMyRecords(0);
  }, [albumStore]);

  const filteredAlbums = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    let result = [...albumStore.albums];
    if (q) {
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        String(a.recordCount).includes(q)
      );
    }
    if (sortBy === "alphabet") {
      result.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    }
    // "date" — порядок с бэка уже по createdAt DESC
    return result;
  }, [albumStore.albums, searchValue, sortBy]);

  // Обработчики модалок
  const handleCreated = async (name: string) => {
    try {
      await albumStore.createAlbum(name);
    } catch {
      // ошибка в сторе
    }
  };

  const handleSaved = async (name: string) => {
    if (!editingAlbum) return;
    try {
      await albumStore.renameAlbum(editingAlbum.id, name);
    } catch {
      // ошибка уже в сторе
    }
  };

  const handleDeleted = async () => {
    if (!editingAlbum) return;
    try {
      await albumStore.deleteAlbum(editingAlbum.id);
    } catch {
      // ошибка уже в сторе
    }
  };

  // Статистика коллекций
  const favoritesCount  = albumStore.favorites.length;
  const myRecordsCount  = albumStore.myRecords.length;

  return (
    <>
    <div className={tracksClasses.tracks}>

      {/* ── Быстрые коллекции ── */}
      <div className={tracksClasses.collections}>
        {/* Избранное */}
        <article className={tracksClasses.collection__card} aria-label={`Избранное, ${favoritesCount} записей`}>
          <div className={tracksClasses.collection__info}>
            <h2 className={tracksClasses.collection__title}>
              Избранное
            </h2>
            <p className={tracksClasses.collection__count}>
              {favoritesCount === 0 ? "Нет записей" : `${favoritesCount} ${pluralRecord(favoritesCount)}`}
            </p>
          </div>
          <img 
            src='src/assets/img/likeImg.png' 
            alt=""
            style={{
              width: "100%",
              maxWidth: 174,
              height: "auto",
              objectFit: "cover",
              borderRadius: "0 20px 20px 0",
          }} aria-hidden="true"
          />
        </article>

        {/* Мои записи */}
        <article className={tracksClasses.collection__card} aria-label={`Мои записи, ${myRecordsCount} записей`}>
          <div className={tracksClasses.collection__info}>
            <h2 className={tracksClasses.collection__title}>Мои записи</h2>
            <p className={tracksClasses.collection__count}>
              {myRecordsCount === 0 ? "Нет записей" : `${myRecordsCount} ${pluralRecord(myRecordsCount)}`}
            </p>
          </div>
          <img 
            src='src/assets/img/recordImg.png' 
            alt=""
            style={{
              width: "100%",
              maxWidth: 174,
              height: "auto",
              objectFit: "cover",
              borderRadius: "0 20px 20px 0",
          }} aria-hidden="true"
          />
        </article>
      </div>

      {/* ── Секция альбомов ── */}
      <section className={tracksClasses.albums__section} aria-labelledby="albums-heading">
        <h2 id="albums-heading" className={tracksClasses.albums__title}>Альбомы</h2>

        <div className={tracksClasses.albums__description}>
          <p>Создавай альбомы по тематикам и сохраняй в них свою любимые композиции!</p>
          <p>Чтобы добавить композицию в альбом, нажми на <strong>+</strong>, а затем выбери нужный альбом из списка.</p>
        </div>

        {/* Поиск */}
        <div className={tracksClasses.search__bar}>
          <SearchIcon />
          <input
            id={searchId}
            type="search"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Найти альбом"
            className={tracksClasses.search__input}
          />
        </div>

        {/* Сортировка */}
        <div className={tracksClasses.sort__bar} role="tablist" aria-label="Сортировка альбомов">
          <button
            type="button" role="tab"
            aria-selected={sortBy === "alphabet"}
            onClick={() => { setSortBy("alphabet"); albumStore.loadAlbums(0, "name"); }}
            className={tracksClasses.sort__btn + (sortBy === "alphabet" ? " " + tracksClasses["sort__btn--active"] : "")}
          >
            <span className={tracksClasses.sort__btn__icon}>АЯ</span> по алфавиту
          </button>
          <button
            type="button" role="tab"
            aria-selected={sortBy === "date"}
            onClick={() => { setSortBy("date"); albumStore.loadAlbums(0, "createdAt"); }}
            className={tracksClasses.sort__btn + (sortBy === "date" ? " " + tracksClasses["sort__btn--active"] : "")}
          >
            📅 по дате добавления
          </button>
        </div>

        {/* Состояние загрузки / ошибки */}
        {albumStore.isLoading && (
          <p style={{ color: "var(--font-color-muted)", fontSize: 14, padding: "8px 0" }}>
            Загрузка...
          </p>
        )}
        {albumStore.error && (
          <p style={{ color: "#db422b", fontSize: 14, padding: "8px 0" }}>
            {albumStore.error}
          </p>
        )}

        {/* Сетка альбомов */}
        <div className={tracksClasses.albums__grid}>
          {filteredAlbums.map(album => (
            <article key={album.id} className={tracksClasses.album__card}>
              <div
                className={tracksClasses.album__cover}
                style={{ background: album.avatarUrl ? `url(${album.avatarUrl}) center/cover` : "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" }}
              >
                <button
                  type="button"
                  className={tracksClasses.album__edit__btn}
                  aria-label={`Редактировать альбом ${album.name}`}
                  onClick={() => setEditingAlbum(album)}
                >
                  <EditIcon /> Редактировать
                </button>
              </div>
              <div>
                <p className={tracksClasses.album__name}>{album.name}</p>
                <p className={tracksClasses.album__count}>
                  {album.recordCount} {pluralRecord(album.recordCount)}
                </p>
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

        {/* Подгрузить ещё */}
        {albumStore.albumsPage < albumStore.albumsTotalPages - 1 && (
          <button
            type="button"
            onClick={() => albumStore.loadAlbums(albumStore.albumsPage + 1)}
            style={{ marginTop: 12, color: "var(--color-accent)", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}
          >
            Загрузить ещё
          </button>
        )}
      </section>
    </div>

    {/* ── Модальные окна ── */}
    {showCreateModal && (
      <CreateAlbumModal
        onClose={() => setShowCreateModal(false)}
        onCreated={(name) => handleCreated(name)}
      />
    )}
    {editingAlbum && (
      <EditAlbumModal
        albumTitle={editingAlbum.name}
        albumCover={editingAlbum.avatarUrl}
        onClose={() => setEditingAlbum(null)}
        onSaved={(name) => handleSaved(name)}
        onDeleted={handleDeleted}
      />
    )}
    </>
  );
});

// Склонение слова
function pluralRecord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "запись";
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return "записи";
  return "записей";
}

export default Tracks;