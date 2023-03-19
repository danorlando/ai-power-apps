import React, { useReducer } from "react";

export type TCompletionState = {
  isSubmitting: boolean;
  submission: any;
  stopStream: boolean;
  disabled: boolean;
  model: string;
  promptPrefix: string | null;
  chatGptLabel: string | null;
  customModel: string | null;
};

const initialState = {
  isSubmitting: false,
  submission: {},
  stopStream: false,
  disabled: true,
  model: "chatgpt",
  promptPrefix: null,
  chatGptLabel: null,
  customModel: null,
};

const CompletionContext = React.createContext<TCompletionState | undefined>(
  undefined
);

export enum CompletionActions {
  setSubmitting = "setSubmitting",
  setSubmission = "setSubmission",
  setStopStream = "setStopStream",
  setDisabled = "setDisabled",
  setModel = "setModel",
  setCustomGpt = "setCustomGpt",
  setCustomModel = "setCustomModel",
}

export type TCompletionAction = {
  type: CompletionActions;
  payload?: any;
};

const setSubmittingAction = (payload: any) => ({
  type: CompletionActions.setSubmitting,
  payload,
});

const setSubmissionAction = (payload: any) => ({
  type: CompletionActions.setSubmission,
  payload,
});

const setStopStreamAction = (payload: any) => ({
  type: CompletionActions.setStopStream,
  payload,
});

const setDisabledAction = (payload: any) => ({
  type: CompletionActions.setDisabled,
  payload,
});

const setModelAction = (payload: any) => ({
  type: CompletionActions.setModel,
  payload,
});

const setCustomGpTCompletionAction = (payload: any) => ({
  type: CompletionActions.setCustomGpt,
  payload,
});

const setCustomModelAction = (payload: any) => ({
  type: CompletionActions.setCustomModel,
  payload,
});

const reducer = (state: TCompletionState, { type, payload }: TCompletionAction) => {
  switch (type) {
    case CompletionActions.setSubmitting:
      return {
        ...state,
        isSubmitting: payload,
      };
    case CompletionActions.setSubmission:
      if (Object.keys(payload).length === 0) {
        return {
          ...state,
          submission: payload,
          isSubmitting: false,
        };
      } else {
        return {
          ...state,
          submission: payload,
        };
      }
    case CompletionActions.setStopStream:
      return {
        ...state,
        stopStream: payload,
      };
    case CompletionActions.setDisabled:
      return {
        ...state,
        disabled: payload,
      };
    case CompletionActions.setModel:
      return {
        ...state,
        model: payload,
      };
    case CompletionActions.setCustomGpt:
      return {
        ...state,
        promptPrefix: payload.promptPrefix,
        chatGptLabel: payload.chatGptLabel,
      };
    case CompletionActions.setCustomModel:
      return {
        ...state,
        setCustomModel: payload,
      };
    default:
      return state;
  }
};

type TCompletionDispatch = React.Dispatch<TCompletionAction>;

const CompletionDispatchContext = React.createContext<TCompletionDispatch | undefined>(undefined);

export const CompletionProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CompletionContext.Provider value={state}>
      <CompletionDispatchContext.Provider value={dispatch}>
        {children}
      </CompletionDispatchContext.Provider>
    </CompletionContext.Provider>
  );
};

export const useCompletionState = () => {
  const context = React.useContext(CompletionContext);
  if (context === undefined) {
    throw new Error("useCompletionState must be used within a CompletionProvider");
  }
  return context;
}

export const useSetSubmitting = () => {
  const dispatch = React.useContext(CompletionDispatchContext);
  if (dispatch === undefined) {
    throw new Error('"useSetSubmitting" must be used inside CompletionContextProvider');
  }
  return React.useCallback((payload: any) => dispatch(setSubmittingAction(payload)), [dispatch]);
}

export const useSetSubmission = () => {
  const dispatch = React.useContext(CompletionDispatchContext);
  if (dispatch === undefined) {
    throw new Error('"useSetSubmission" must be used inside CompletionContextProvider');
  }
  return React.useCallback((payload: any) => dispatch(setSubmissionAction(payload)), [dispatch]);
}

export const useSetStopStream = () => {
  const dispatch = React.useContext(CompletionDispatchContext);
  if (dispatch === undefined) {
    throw new Error('"useSetStopStream" must be used inside CompletionContextProvider');
  }
  return React.useCallback((payload: any) => dispatch(setStopStreamAction(payload)), [dispatch]);
}

export const useSetDisabled = () => {
  const dispatch = React.useContext(CompletionDispatchContext);
  if (dispatch === undefined) {
    throw new Error('"useSetDisabled" must be used inside CompletionContextProvider');
  }
  return React.useCallback((payload: any) => dispatch(setDisabledAction(payload)), [dispatch]);
}

export const useSetModel = () => {
  const dispatch = React.useContext(CompletionDispatchContext);
  if (dispatch === undefined) {
    throw new Error('"useSetModel" must be used inside CompletionContextProvider');
  }
  return React.useCallback((payload: any) => dispatch(setModelAction(payload)), [dispatch]);
}

export const useSetCustomGpt = () => {
  const dispatch = React.useContext(CompletionDispatchContext);
  if (dispatch === undefined) {
    throw new Error('"useSetCustomGpt" must be used inside CompletionContextProvider');
  }
  return React.useCallback((payload: any) => dispatch(setCustomGpTCompletionAction(payload)), [dispatch]);
}

export const useSetCustomModel = () => {
  const dispatch = React.useContext(CompletionDispatchContext);
  if (dispatch === undefined) {
    throw new Error('"useSetCustomModel" must be used inside CompletionContextProvider');
  }
  return React.useCallback((payload: any) => dispatch(setCustomModelAction(payload)), [dispatch]);
}
