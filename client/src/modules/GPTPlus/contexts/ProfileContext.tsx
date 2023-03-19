import React, { useReducer } from "react";

export type TProfileState = {
  user: any;
};

const initialState = {
  user: null,
};

const ProfileContext = React.createContext<TProfileState | undefined>(
  undefined
);

export enum ProfileActions {
  setUser = "setUser",
}

export type TProfileAction = {
  type: ProfileActions;
  payload?: any;
};

const setUserAction = (payload: any) => ({
  type: ProfileActions.setUser,
  payload,
});

const reducer = (state: TProfileState, { type, payload }: TProfileAction) => {
  switch (type) {
    case ProfileActions.setUser:
      return {
        user: payload,
      };
    default:
      return state;
  }
}

type TProfileDispatch = React.Dispatch<TProfileAction>;

const ProfileDispatchContext = React.createContext<TProfileDispatch | undefined>(
  undefined
);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ProfileContext.Provider value={state}>
      <ProfileDispatchContext.Provider value={dispatch}>
        {children}
      </ProfileDispatchContext.Provider>
    </ProfileContext.Provider>
  );
};

export const useProfileState = () => {
  const context = React.useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfileState must be used within a ProfileProvider");
  }
  return context;
}

export const useSetUser = () => {
  const dispatch = React.useContext(ProfileDispatchContext);
  if (dispatch === undefined) {
    throw new Error("useSetUser must be used within a ProfileDispatchContext");
  }
  return React.useCallback(
    (payload: any) => dispatch(setUserAction(payload)),
    [dispatch]
  );
}
