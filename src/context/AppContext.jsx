import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { STORAGE_KEYS } from "../utils/constants";

const initialState = {
  activeTab: "homes",
  search: {
    location: null,
    startDate: null,
    endDate: null,
    guests: { adults: 0, children: 0, infants: 0, pets: 0 },
    flex: 0,
  },
  wishlist: [],
  modals: {
    search: false,
    datePicker: false,
    guestPicker: false,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };

    case "SET_SEARCH":
      return { ...state, search: { ...action.payload } };

    case "PATCH_SEARCH":
      return { ...state, search: { ...state.search, ...action.payload } };

    case "RESET_SEARCH":
      return { ...state, search: initialState.search };

    case "SET_WISHLIST":
      return { ...state, wishlist: [...action.payload] };

    case "TOGGLE_WISHLIST": {
      const id = action.payload;
      const set = new Set(state.wishlist);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...state, wishlist: [...set] };
    }

    case "OPEN_MODAL":
      return { ...state, modals: { ...state.modals, [action.payload]: true } };

    case "CLOSE_MODAL":
      return { ...state, modals: { ...state.modals, [action.payload]: false } };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const wl = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || "[]");
      if (Array.isArray(wl)) dispatch({ type: "SET_WISHLIST", payload: wl });
    } catch {}

    try {
      const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.SESSION_SEARCH) || "null");
      if (session && typeof session === "object") {
        const startDate = session.startDate ? new Date(session.startDate) : null;
        const endDate = session.endDate ? new Date(session.endDate) : null;
        dispatch({
          type: "SET_SEARCH",
          payload: { ...initialState.search, ...session, startDate, endDate },
        });
      }
    } catch {console.error();}
  }, []);


  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(state.wishlist));
    } catch {}
  }, [state.wishlist]);


  useEffect(() => {
    try {
      const { startDate, endDate, ...rest } = state.search || {};
      sessionStorage.setItem(
        STORAGE_KEYS.SESSION_SEARCH,
        JSON.stringify({
          ...rest,
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null,
        })
      );
    } catch {}
  }, [state.search]);

  const setActiveTab = useCallback((key) => dispatch({ type: "SET_ACTIVE_TAB", payload: key }), []);
  const setSearch = useCallback((payload) => dispatch({ type: "SET_SEARCH", payload }), []);
  const updateSearch = useCallback((partial) => dispatch({ type: "PATCH_SEARCH", payload: partial }), []);
  const resetSearch = useCallback(() => dispatch({ type: "RESET_SEARCH" }), []);
  const openModal = useCallback((name) => dispatch({ type: "OPEN_MODAL", payload: name }), []);
  const closeModal = useCallback((name) => dispatch({ type: "CLOSE_MODAL", payload: name }), []);
  const toggleWishlist = useCallback((id) => dispatch({ type: "TOGGLE_WISHLIST", payload: id }), []);

  const isWishlisted = useCallback((id) => state.wishlist.includes(id), [state.wishlist]);

  const value = useMemo(
    () => ({
      state,
      setActiveTab,
      setSearch,
      updateSearch,
      resetSearch,
      openModal,
      closeModal,
      toggleWishlist,
      isWishlisted,
    }),
    [state, setActiveTab, setSearch, updateSearch, resetSearch, openModal, closeModal, toggleWishlist, isWishlisted]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export default AppContext;