// context/Context.ts
import React from "react";
import Store from "../store/store";
import AlbumStore from "../store/AlbumStore";
import ProfileStore from "../store/ProfileStore";

interface State {
    store: Store;
    albumStore: AlbumStore;
    profileStore: ProfileStore;
}

export const store        = new Store();
export const albumStore   = new AlbumStore();
export const profileStore = new ProfileStore();

export const Context = React.createContext<State>({
    store,
    albumStore,
    profileStore,
});