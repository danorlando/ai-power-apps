// @ts-ignore
import { SSE } from "../utils/sse.js";
import resetConversation from "../utils/resetConversation";
import {
  useSetNewConversation,
  useSetError,
  useConversationState,
  useMessageState,
  useSetMessages,
  useSetSubmitting,
  useSetText,
  useSetSubmission,
  useModelState,
  useCompletionState,
  useTextState,
} from "@modules/GPTPlus/contexts";
import { v4 } from "uuid";
import { TMessage, TConversation } from "@data-provider";

export type TCreateCompletionProps = {
  shouldRegenerate: boolean;
};

export const useSubmitMesssage = () => {
  const conversation = useConversationState();
  const { initial } = useModelState();
  const { messages } = useMessageState();
  const { model, chatGptLabel, promptPrefix, isSubmitting } =
    useCompletionState();
  const { text } = useTextState();
  const { latestMessage, error } = conversation;

  const setError = useSetError();
  const setNewConversation = useSetNewConversation();
  const setMessages = useSetMessages();
  const setText = useSetText();
  const setSubmitting = useSetSubmitting();
  const setSubmission = useSetSubmission();

  type TcreateCompletionProps = {
    text: string;
    parentMessageId?: string;
    conversationId?: string;
    messageId?: string;
  };
  const createCompletion = (
    {
      text,
      parentMessageId,
      conversationId,
      messageId,
    }: TcreateCompletionProps,
    { shouldRegenerate = false }: { shouldRegenerate?: boolean } = {}
  ) => {
    if (error) {
      setError(false);
    }

    if (!isSubmitting || text === "") {
      return;
    }

    text = text.trim();
    const initialMessageId = v4();
    // @ts-ignore
    const isCustomModel = model === "chatgptCustom" || !initial[model];
    const sender = model === "chatgptCustom" ? chatGptLabel : model;
    parentMessageId =
      parentMessageId ||
      latestMessage?.messageId ||
      "00000000-0000-0000-0000-000000000000";

    if (resetConversation({ messages, sender })) {
      parentMessageId = "00000000-0000-0000-0000-000000000000";
      // @ts-ignore
      conversationId = null;
      setNewConversation();
      setMessages([]);
    }
    const currentMsg = {
      sender: "User",
      text,
      current: true,
      isCreatedByUser: true,
      parentMessageId,
      conversationId,
      messageId: initialMessageId,
    };
    const initialResponse = {
      sender,
      text: "",
      parentMessageId: shouldRegenerate ? messageId : initialMessageId,
      messageId: (shouldRegenerate ? messageId : initialMessageId) + "_",
      submitting: true,
    };

    const submission = {
      conversation,
      isCustomModel,
      message: {
        ...currentMsg,
        model,
        chatGptLabel,
        promptPrefix,
        overrideParentMessageId: shouldRegenerate ? messageId : null,
      },
      messages: messages,
      shouldRegenerate,
      initialResponse,
      sender,
    };

    console.log("User Input:", text);

    if (shouldRegenerate) {
      // @ts-ignore TODO: fix type issue
      setMessages([...messages, initialResponse]);
    } else {
      // @ts-ignore TODO: fix type issue
      setMessages([...messages, currentMsg, initialResponse]);
      setText("");
    }
    setSubmitting(true);
    setSubmission(submission);
  };

  const regenerate = ({
    parentMessageId,
  }: Pick<TMessage, "parentMessageId">) => {
    const parentMessage = messages?.find(
      (element) => element.messageId == parentMessageId
    );

    if (parentMessage && parentMessage.isCreatedByUser)
      createCompletion({ ...parentMessage }, { shouldRegenerate: true });
    else
      console.error(
        "Failed to regenerate the message: parentMessage not found or not created by user.",
        latestMessage
      );
  };

  const stopGenerating = () => {
    setSubmission({});
  };

  return { createCompletion, regenerate, stopGenerating };
};

type TSubmitMessageProps = {
  model: string;
  text: string;
  conversation: TConversation;
  messageRecievedHandler: (text: string, events: any) => void;
  conversationChangeHandler: (conversation: TConversation) => void;
  errorHandler: (error: any) => void;
  chatGptLabel: string;
  promptPrefix: string;
};

export default function submitMessage({
  model,
  text,
  conversation,
  messageRecievedHandler,
  conversationChangeHandler,
  errorHandler,
  chatGptLabel,
  promptPrefix,
}: TSubmitMessageProps) {
  const endpoint = `/api/ask`;
  let payload = { model, text, chatGptLabel, promptPrefix };
  if (conversation.conversationId && conversation.parentMessageId) {
    payload = {
      ...payload,
      // @ts-ignore
      conversationId: conversation.conversationId,
      parentMessageId: conversation.parentMessageId,
    };
  }

  const isBing = model === "bingai" || model === "sydney";
  if (isBing && conversation.conversationId) {
    payload = {
      ...payload,
      // @ts-ignore
      jailbreakConversationId: conversation.jailbreakConversationId,
      conversationId: conversation.conversationId,
      conversationSignature: conversation.conversationSignature,
      clientId: conversation.clientId,
      invocationId: conversation.invocationId,
    };
  }

  let server = endpoint;
  server = model === "bingai" ? server + "/bing" : server;
  server = model === "sydney" ? server + "/sydney" : server;

  const events = new SSE(server, {
    payload: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  events.onopen = function () {
    console.log("connection is opened");
  };

  events.onmessage = function (e: any) {
    const data = JSON.parse(e.data);
    let text = data.text || data.response;
    if (data.message) {
      messageRecievedHandler(text, events);
    }

    if (data.final) {
      conversationChangeHandler(data);
      console.log("final", data);
    } else {
      // console.log('dataStream', data);
    }
  };

  events.onerror = function (e: any) {
    console.log("error opening connection.");
    events.close();
    errorHandler(e);
  };

  events.addEventListener("stop", () => {
    console.log("stop event received");
    events.close();
  });

  events.stream();
}
