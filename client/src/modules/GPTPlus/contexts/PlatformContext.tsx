import React, { useReducer } from "react";
import type { TPlatform } from "@data-provider";

export type TPlatformState = {
  models: TPlatform[];
  modelMap: {};
  initial: {};
};

const initialState = {
  models: [
    {
      _id: "0",
      name: "ChatGPT",
      value: "chatgpt",
      model: "chatgpt",
    },
    {
      _id: "1",
      name: "CustomGPT",
      value: "chatgptCustom",
      model: "chatgptCustom",
    },
    {
      _id: "2",
      name: "BingAI",
      value: "bingai",
      model: "bingai",
    },
    {
      _id: "3",
      name: "Sydney",
      value: "sydney",
      model: "sydney",
    },
    {
      _id: "4",
      name: "ChatGPT",
      value: "chatgptBrowser",
      model: "chatgptBrowser",
    },
  ],
  modelMap: {},
  initial: {
    chatgpt: false,
    chatgptCustom: false,
    bingai: false,
    sydney: false,
    chatgptBrowser: false,
  },
};

const PlatformContext = React.createContext<TPlatformState | undefined>(
  undefined
);

export enum PlatformActions {
  setModels = "setModels",
  setInitial = "setInitial",
}

export type TPlatformAction = {
  type: PlatformActions;
  payload?: any;
};

const setModelsAction = (payload: any) => ({
  type: PlatformActions.setModels,
  payload,
});

const setInitialAction = (payload: any) => ({
  type: PlatformActions.setInitial,
  payload,
});

const reducer = (state: TPlatformState, { type, payload }: TPlatformAction) => {
  switch (type) {
    case PlatformActions.setModels:
      const models = [...initialState.models, ...payload];
      state.models = models;
      const modelMap: any = {};

      models.slice(initialState.models.length).forEach((modelItem) => {
        modelMap[modelItem.value] = {
          chatGptLabel: modelItem.chatGptLabel,
          promptPrefix: modelItem.promptPrefix,
          model: "chatgptCustom",
        };
      });
      state.modelMap = modelMap;

      return {
        ...state,
      };
    case PlatformActions.setInitial:
      return {
        ...state,
        initial: payload,
      };
    default:
      return state;
  }
};

type TPlatformDispatch = React.Dispatch<TPlatformAction>;

const PlatformDispatchContext = React.createContext<TPlatformDispatch | undefined>(
  undefined
);

export const PlatformProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <PlatformContext.Provider value={state}>
      <PlatformDispatchContext.Provider value={dispatch}>
        {children}
      </PlatformDispatchContext.Provider>
    </PlatformContext.Provider>
  );
};

export const usePlatformState = () => {
  const context = React.useContext(PlatformContext);
  if (context === undefined) {
    throw new Error("usePlatformState must be used within a PlatformProvider");
  }
  return context;
}

export const useSetPlatforms = () => {
  const dispatch = React.useContext(PlatformDispatchContext);
  if (dispatch === undefined) {
    throw new Error("useSetPlatforms must be used within a PlatformProvider");
  }
  return React.useCallback(
    (payload: any) => dispatch(setModelsAction(payload)),
    [dispatch]
  );
}

export const useSetInitialPlatforms = () => {
  const dispatch = React.useContext(PlatformDispatchContext);
  if (dispatch === undefined) {
    throw new Error("useSetInitial must be used within a PlatformProvider");
  }
  return React.useCallback(
    (payload: any) => dispatch(setInitialAction(payload)),
    [dispatch]
  );
}


