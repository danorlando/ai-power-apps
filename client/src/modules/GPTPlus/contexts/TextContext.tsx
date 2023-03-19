import React, { useReducer } from "react";

export type TTextState = {
  text: string;
};

const initialState = {
  text: "",
};

const TextContext = React.createContext<TTextState | undefined>(undefined);

export enum TextActions {
  setText = "setText",
}

export type TTextAction = {
  type: TextActions;
  payload?: any;
};

const setTextAction = (payload: string) => ({
  type: TextActions.setText,
  payload,
});

const reducer = (state: TTextState, { type, payload }: TTextAction) => {
  switch (type) {
    case TextActions.setText:
      return {
        text: payload,
      };
    default:
      return state;
  }
};

type TTextDispatch = React.Dispatch<TTextAction>;

const TextDispatchContext = React.createContext<TTextDispatch | undefined>(
  undefined
);

export const TextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TextContext.Provider value={state}>
      <TextDispatchContext.Provider value={dispatch}>
        {children}
      </TextDispatchContext.Provider>
    </TextContext.Provider>
  );
};

export const useTextState = () => {
  const context = React.useContext(TextContext);
  if (context === undefined) {
    throw new Error("useTextState must be used within a TextProvider");
  }
  return context;
};

export const useSetText = () => {
  const dispatch = React.useContext(TextDispatchContext);
  if (dispatch === undefined) {
    throw new Error("useSetText must be used within a TextDispatchContext");
  }
  return React.useCallback(
    (payload: string) => dispatch(setTextAction(payload)),
    [dispatch]
  );
};
