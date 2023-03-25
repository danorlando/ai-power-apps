import React, { useState, useReducer } from "react";
import { TConversation, TMessage } from "@data-provider";

type TConversationState = {
  error: boolean;
  title: string;
  conversationId: string | null;
  parentMessageId: string | null;
  jailbreakConversationId: string | null;
  conversationSignature: string | null;
  clientId: string | null;
  invocationId: string | null;
  chatGptLabel: string | null;
  promptPrefix: string | null;
  convosLoading: boolean;
  pageNumber: number;
  pages: number;
  refreshConvoHint: number;
  latestMessage: TMessage | null;
  convos: TConversation[];
};

const initialState = {
  error: false,
  title: "ChatGPT+",
  conversationId: null,
  parentMessageId: null,
  jailbreakConversationId: null,
  conversationSignature: null,
  clientId: null,
  invocationId: null,
  chatGptLabel: null,
  promptPrefix: null,
  convosLoading: false,
  pageNumber: 1,
  pages: 1,
  refreshConvoHint: 0,
  latestMessage: null,
  convos: [],
};

const ConversationContext = React.createContext<TConversationState | undefined>(
  initialState
);

export enum ConversationActions {
  refreshConversation = "refreshConversation",
  setConversation = "setConversation",
  setPages = "setPages",
  setConversations = "setConvos",
  setNewConversation = "setNewConvo",
  setError = "setError",
  increasePage = "increasePage",
  decreasePage = "decreasePage",
  setPageNumber = "setPageNumber",
  removeConversation = "removeConversation",
  removeAll = "removeAll",
  setLatestMessage = "setLatestMessage",
}

export type TConversationAction = {
  type: ConversationActions;
  payload?: any;
};

const refreshConversationAction = () => ({
  type: ConversationActions.refreshConversation,
});

const setConversationAction = (payload: any) => ({
  type: ConversationActions.setConversation,
  payload,
});

const setPagesAction = (payload: any) => ({
  type: ConversationActions.setPages,
  payload,
});

const setConversationsAction = (payload: any) => ({
  type: ConversationActions.setConversations,
  payload,
});

const setNewConversationAction = () => ({
  type: ConversationActions.setNewConversation,
});

const setErrorAction = (payload: any) => ({
  type: ConversationActions.setError,
  payload,
});

const increasePageAction = () => ({
  type: ConversationActions.increasePage,
});

const decreasePageAction = () => ({
  type: ConversationActions.decreasePage,
});

const setPageNumberAction = (payload: any) => ({
  type: ConversationActions.setPageNumber,
  payload,
});

const removeConversationAction = (payload: any) => ({
  type: ConversationActions.removeConversation,
  payload,
});

const removeAllAction = () => ({
  type: ConversationActions.removeAll,
});

const setLatestMessageAction = (payload: any) => ({
  type: ConversationActions.setLatestMessage,
  payload,
});

const reducer = (
  state: TConversationState,
  { type, payload }: TConversationAction
) => {
  switch (type) {
    case ConversationActions.refreshConversation:
      return {
        ...state,
        refreshConvoHint: state.refreshConvoHint + 1,
      };
    case ConversationActions.setConversation:
      return {
        ...state,
        ...payload,
      };
    case ConversationActions.setPages:
      return {
        ...state,
        pages: payload || 1,
      };
    case ConversationActions.setConversations:
      return {
        ...state,
        convos: payload?.sort(
          // @ts-ignore
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      };
    case ConversationActions.setNewConversation:
      return {
        ...state,
        error: false,
        title: "ChatGPT Clone",
        conversationId: null,
        parentMessageId: null,
        jailbreakConversationId: null,
        conversationSignature: null,
        clientId: null,
        invocationId: null,
        chatGptLabel: null,
        promptPrefix: null,
        convosLoading: false,
        latestMessage: null,
      };
    case ConversationActions.setError:
      return {
        ...state,
        error: payload,
      };
    case ConversationActions.increasePage:
      return {
        ...state,
        pageNumber: state.pageNumber + 1,
      };
    case ConversationActions.decreasePage:
      return {
        ...state,
        pageNumber: state.pageNumber - 1,
      };
    case ConversationActions.setPageNumber:
      return {
        ...state,
        pageNumber: payload || 1,
      };
    case ConversationActions.removeConversation:
      return {
        ...state,
        convos: state.convos.filter(
          (convo) => convo.conversationId !== payload
        ),
      };
    case ConversationActions.removeAll:
      return {
        ...state,
        convos: [],
      };
    case ConversationActions.setLatestMessage:
      return {
        ...state,
        latestMessage: payload,
      };
    default:
      return state;
  }
};

type TConversationDispatch = React.Dispatch<TConversationAction>;

const ConversationDispatchContext = React.createContext<
  TConversationDispatch | undefined
>(undefined);

export const ConversationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [error, setError] = useState(false);

  return (
    <ConversationContext.Provider value={state}>
      <ConversationDispatchContext.Provider value={dispatch}>
        {children}
      </ConversationDispatchContext.Provider>
    </ConversationContext.Provider>
  );
};

export const useConversationState = () => {
  const context = React.useContext(ConversationContext);
  if (context === undefined) {
    throw new Error(
      "useConversationState must be used within a ConversationProvider"
    );
  }
  return context;
};

export const useConversationDispatch = () => {
  const context = React.useContext(ConversationDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useConversationDispatch must be used within a ConversationProvider"
    );
  }
  return context;
};

export const useRefreshConversation = () => {
  const dispatch = React.useContext(ConversationDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      '"useShowBanner" must be used inside BannerContextProvider'
    );
  }
  return React.useCallback(
    () => dispatch(refreshConversationAction()),
    [dispatch]
  );
};

export const useSetConversation = () => {
  const dispatch = React.useContext(ConversationDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      '"useShowBanner" must be used inside BannerContextProvider'
    );
  }
  return React.useCallback(
    (payload: any) => dispatch(setConversationAction(payload)),
    [dispatch]
  );
};

export const useSetPages = () => {
  const dispatch = React.useContext(ConversationDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      '"useShowBanner" must be used inside BannerContextProvider'
    );
  }
  return React.useCallback(
    (payload: any) => dispatch(setPagesAction(payload)),
    [dispatch]
  );
};

export const useSetConversations = () => {
  const dispatch = React.useContext(ConversationDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      '"useShowBanner" must be used inside BannerContextProvider'
    );
  }
  return React.useCallback(
    (payload: any) => dispatch(setConversationsAction(payload)),
    [dispatch]
  );
};

export const useSetNewConversation = () => {
  const dispatch = React.useContext(ConversationDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      '"useShowBanner" must be used inside BannerContextProvider'
    );
  }
  return React.useCallback(
    () => dispatch(setNewConversationAction()),
    [dispatch]
  );
};

export const useSetError = () => {
  const dispatch = React.useContext(ConversationDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      '"useShowBanner" must be used inside BannerContextProvider'
    );
  }
  return React.useCallback(
    (payload: any) => dispatch(setErrorAction(payload)),
    [dispatch]
  );
};

export const useIncreasePage = () => {
  const dispatch = React.useContext(ConversationDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      '"useShowBanner" must be used inside BannerContextProvider'
    );
  }
  return React.useCallback(() => dispatch(increasePageAction()), [dispatch]);
};

export const useDecreasePage = () => {
  const dispatch = React.useContext(ConversationDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      '"useShowBanner" must be used inside BannerContextProvider'
    );
  }
  return React.useCallback(() => dispatch(decreasePageAction()), [dispatch]);
};

export const useSetPageNumber = () => {
  const dispatch = React.useContext(ConversationDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      '"useShowBanner" must be used inside BannerContextProvider'
    );
  }
  return React.useCallback(
    (payload: any) => dispatch(setPageNumberAction(payload)),
    [dispatch]
  );
};

export const useRemoveConversation = () => {
  const dispatch = React.useContext(ConversationDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      '"useShowBanner" must be used inside BannerContextProvider'
    );
  }
  return React.useCallback(
    (payload: any) => dispatch(removeConversationAction(payload)),
    [dispatch]
  );
};

export const useRemoveAll = () => {
  const dispatch = React.useContext(ConversationDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      '"useShowBanner" must be used inside BannerContextProvider'
    );
  }
  return React.useCallback(() => dispatch(removeAllAction()), [dispatch]);
};

export const useSetLatestMessage = () => {
  const dispatch = React.useContext(ConversationDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      '"useShowBanner" must be used inside BannerContextProvider'
    );
  }
  return React.useCallback(
    (payload: any) => dispatch(setLatestMessageAction(payload)),
    [dispatch]
  );
};
