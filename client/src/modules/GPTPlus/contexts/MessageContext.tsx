import React, { useReducer } from "react";
import buildTree from "@modules/GPTPlus/utils";
import type { TMessage } from "@data-provider";

export type TMessageState = {
  messages: TMessage[];
  messageTree: any[];
};

const initialState = {
  messages: [],
  messageTree: [],
};

const MessageContext = React.createContext<TMessageState | undefined>(
  undefined
);

export enum MessageActions {
  setMessages = "setMessages",
  setEmptyMessage = "setEmptyMessage",
}

export type TMessageAction = {
  type: MessageActions;
  payload?: any;
};

const setMessagesAction = (payload: any) => ({
  type: MessageActions.setMessages,
  payload,
});

const setEmptyMessageAction = () => ({
  type: MessageActions.setEmptyMessage,
});

const reducer = (state: TMessageState, { type, payload }: TMessageAction) => {
  switch (type) {
    case MessageActions.setMessages:
      return {
        messages: payload,
        messageTree: buildTree(payload),
      };
    case MessageActions.setEmptyMessage:
      return {
        ...state,
        messages: [
          {
            messageId: "1",
            conversationId: "1",
            parentMessageId: "1",
            sender: "",
            text: "",
          },
        ],
      };
    default:
      return state;
  }
};

type TMessageDispatch = React.Dispatch<TMessageAction>;

const MessageDispatchContext = React.createContext<
  TMessageDispatch | undefined
>(undefined);

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageContext.Provider value={state}>
        {children}
      </MessageContext.Provider>
    </MessageDispatchContext.Provider>
  );
};

export const useMessageState = () => {
  const context = React.useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessageState must be used within a MessageProvider");
  }
  return context;
}

export const useSetMessages = () => {
  const dispatch = React.useContext(MessageDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      "useSetMessages must be used within a MessageDispatchContext"
    );
  }
  return React.useCallback(
    (payload: TMessage[]) => dispatch(setMessagesAction(payload)),
    [dispatch]
  );
}

export const useSetEmptyMessage = () => {
  const dispatch = React.useContext(MessageDispatchContext);
  if (dispatch === undefined) {
    throw new Error(
      "useSetEmptyMessage must be used within a MessageDispatchContext"
    );
  }
  return React.useCallback(() => dispatch(setEmptyMessageAction()), [dispatch]);
}


