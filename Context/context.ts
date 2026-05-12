// context/Context.ts
// Добавь AlbumStore рядом с существующим Store

import React from "react";
import Store from "../store/store";
import AlbumStore from "../store/AlbumStore";

// Если у тебя уже есть Context — просто добавь albumStore в него

interface State {
    store: Store;
    albumStore: AlbumStore;
}

export const store      = new Store();
export const albumStore = new AlbumStore();

export const Context = React.createContext<State>({
    store,
    albumStore,
});