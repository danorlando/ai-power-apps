import React, { useReducer } from "react";
import type { TModel } from "@data-provider";

export enum EModel {
  chatgpt = "chatgpt",
  chatgptCustom = "chatgptCustom",
  chatgptBrowser = "chatgptBrowser",
  bingai = "bingai",
  sydney = "sydney",
}

export type TModelState = {
  models: TModel[];
  modelMap: any;
  initial: {
    chatgpt: boolean;
    chatgptCustom: boolean;
    bingai: boolean;
    sydney: boolean;
    chatgptBrowser: boolean;
  };
};

const initialState = {
  models: [
    {
      _id: "0",
      name: "ChatGPT",
      value: EModel.chatgpt,
      model: EModel.chatgpt,
    },
    {
      _id: "1",
      name: "CustomGPT",
      value: EModel.chatgptCustom,
      model: EModel.chatgptCustom,
    },
    {
      _id: "2",
      name: "BingAI",
      value: EModel.bingai,
      model: EModel.bingai,
    },
    {
      _id: "3",
      name: "Sydney",
      value: EModel.sydney,
      model: EModel.sydney,
    },
    {
      _id: "4",
      name: "ChatGPT",
      value: EModel.chatgptBrowser,
      model: EModel.chatgptBrowser,
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

const ModelContext = React.createContext<TModelState | undefined>(initialState);

export enum ModelActions {
  setModels = "setModels",
  setInitial = "setInitial",
}

export type TModelAction = {
  type: ModelActions;
  payload?: any;
};

const setModelsAction = (payload: any) => ({
  type: ModelActions.setModels,
  payload,
});

const setInitialAction = (payload: any) => ({
  type: ModelActions.setInitial,
  payload,
});

const reducer = (state: TModelState, { type, payload }: TModelAction) => {
  switch (type) {
    case ModelActions.setModels:
      const models = [...initialState.models, ...payload];
      state.models = models;
      const modelMap: any = {};

      models.slice(initialState.models.length).forEach((modelItem) => {
        modelMap[modelItem.value] = {
          chatGptLabel: modelItem.chatGptLabel,
          promptPrefix: modelItem.promptPrefix,
          model: EModel.chatgptCustom,
        };
      });
      state.modelMap = modelMap;

      return {
        ...state,
      };
    case ModelActions.setInitial:
      return {
        ...state,
        initial: payload,
      };
    default:
      return state;
  }
};

type TModelDispatch = React.Dispatch<TModelAction>;

const ModelDispatchContext = React.createContext<TModelDispatch | undefined>(
  undefined
);

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ModelContext.Provider value={state}>
      <ModelDispatchContext.Provider value={dispatch}>
        {children}
      </ModelDispatchContext.Provider>
    </ModelContext.Provider>
  );
};

export const useModelState = () => {
  const context = React.useContext(ModelContext);
  if (context === undefined) {
    throw new Error("useModelState must be used within a ModelProvider");
  }
  return context;
};

export const useSetModels = () => {
  const dispatch = React.useContext(ModelDispatchContext);
  if (dispatch === undefined) {
    throw new Error("useSetModels must be used within a ModelProvider");
  }
  return React.useCallback(
    (payload: any) => dispatch(setModelsAction(payload)),
    [dispatch]
  );
};

export const useSetInitialModels = () => {
  const dispatch = React.useContext(ModelDispatchContext);
  if (dispatch === undefined) {
    throw new Error("useSetInitial must be used within a ModelProvider");
  }
  return React.useCallback(
    (payload: any) => dispatch(setInitialAction(payload)),
    [dispatch]
  );
};
