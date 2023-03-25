import React, { useReducer } from "react";

export type TSearchState = {
  isSearching: boolean;
  searchQuery: string;
};

const initialState = {
  isSearching: false,
  searchQuery: "",
};

const SearchContext = React.createContext<TSearchState | undefined>(undefined);

export enum SearchActions {
  setIsSearching = "setIsSearching",
  setSearchQuery = "setSearchQuery",
}

export type TSearchAction = {
  type: SearchActions;
  payload?: any;
};

const setIsSearchingAction = (payload: boolean) => ({
  type: SearchActions.setIsSearching,
  payload,
});

const setSearchQueryAction = (payload: string) => ({
  type: SearchActions.setSearchQuery,
  payload,
});

const reducer = (state: TSearchState, { type, payload }: TSearchAction) => {
  switch (type) {
    case SearchActions.setIsSearching:
      return {
        ...state,
        isSearching: payload,
      };
    case SearchActions.setSearchQuery:
      if (payload === '') {
        state.isSearching = false;
      } else if (payload?.length > 0 && !state.isSearching) {
        state.isSearching = true;
      } 
    return {
        ...state,
        searchQuery: payload,
      };
    default:
      return state;
  }
}

type TSearchDispatch = React.Dispatch<TSearchAction>;

const SearchDispatchContext = React.createContext<TSearchDispatch | undefined>(
  undefined
);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SearchContext.Provider value={state}>
      <SearchDispatchContext.Provider value={dispatch}>
        {children}
      </SearchDispatchContext.Provider>
    </SearchContext.Provider>
  );
};

export const useSearchState = () => {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchState must be used within a SearchProvider");
  }
  return context;
}

export const useSetIsSearching = () => {
  const dispatch = React.useContext(SearchDispatchContext);
  if (dispatch === undefined) {
    throw new Error('"useSetIsSearching" must be used inside SearchProvider');
  }
  return React.useCallback(
    (payload: boolean) => dispatch(setIsSearchingAction(payload)),
    [dispatch]
  );
}

export const useSetSearchQuery = () => {
  const dispatch = React.useContext(SearchDispatchContext);
  if (dispatch === undefined) {
    throw new Error('"useSetSearchQuery" must be used inside SearchProvider');
  }
  return React.useCallback(
    (payload: string) => dispatch(setSearchQueryAction(payload)),
    [dispatch]
  );
}