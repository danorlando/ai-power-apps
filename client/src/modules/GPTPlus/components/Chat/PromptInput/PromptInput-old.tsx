import { useEffect, useRef, useState } from "react";
// @ts-ignore
import { SSE } from "../../../utils/sse.js";
import SubmitButton from "./SubmitButton";
// import RegenerateButton from './RegenerateButton';
import ModelMenu from "../ModelMenu";
import { InputTextarea } from "primereact/inputtextarea";
import createPayload from "@modules/GPTPlus/utils";
// import resetConvo from '~/utils/resetConvo';
import { RegenerateIcon, StopGeneratingIcon } from "@common/icons";
import classNames from "classnames";
import {
  useSetConversation,
  useSetError,
  useRefreshConversation,
  useSetMessages,
  useSetSubmitting,
  useToggleCursor,
  useSetText,
  useConversationState,
  useProfileState,
  useModelState,
  useCompletionState,
  useTextState,
} from "@modules/GPTPlus/contexts";
import { useSubmitMesssage } from "@modules/GPTPlus/hooks";
import styles from "./styles.module.css";
import { TMessage } from "@data-provider";

export default function PromptInput({ messages }: { messages: TMessage[] }) {
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef(null);
  const isComposing = useRef(false);
  const { user } = useProfileState();
  const convo = useConversationState();
  const { initial } = useModelState();
  const {
    isSubmitting,
    stopStream,
    submission,
    disabled,
    model,
    chatGptLabel,
    promptPrefix,
  } = useCompletionState();
  const { text } = useTextState();
  const setConversation = useSetConversation();
  const setError = useSetError();
  const refreshConversation = useRefreshConversation();
  const setMessages = useSetMessages();
  const setSubmitting = useSetSubmitting();
  const toggleCursor = useToggleCursor();
  const setText = useSetText();

  const { error, latestMessage } = convo;
  const { createCompletion, regenerate, stopGenerating } = useSubmitMesssage();

  const isNotAppendable = latestMessage?.cancelled || latestMessage?.error;

  // auto focus to input, when enter a conversation.
  useEffect(() => {
    // @ts-ignore
    inputRef.current?.focus();
  }, [convo?.conversationId]);

  const messageHandler = (data: any, currentState: any, currentMsg: any) => {
    const { messages, _currentMsg, message, sender, isRegenerate } =
      currentState;

    if (isRegenerate)
      setMessages([
        ...messages,
        {
          sender,
          text: data,
          parentMessageId: message?.overrideParentMessageId,
          messageId: message?.overrideParentMessageId + "_",
          submitting: true,
        },
      ]);
    else
      setMessages([
        ...messages,
        currentMsg,
        {
          sender,
          text: data,
          parentMessageId: currentMsg?.messageId,
          messageId: currentMsg?.messageId + "_",
          submitting: true,
        },
      ]);
  };

  const cancelHandler = (data: any, currentState: any, currentMsg: any) => {
    const { messages, _currentMsg, message, sender, isRegenerate } =
      currentState;

    if (isRegenerate)
      setMessages([
        ...messages,
        {
          sender,
          text: data,
          parentMessageId: message?.overrideParentMessageId,
          messageId: message?.overrideParentMessageId + "_",
          cancelled: true,
        },
      ]);
    else
      setMessages([
        ...messages,
        currentMsg,
        {
          sender,
          text: data,
          parentMessageId: currentMsg?.messageId,
          messageId: currentMsg?.messageId + "_",
          cancelled: true,
        },
      ]);
  };

  const createdHandler = (data: any, currentState: any, currentMsg: any) => {
    const { conversationId } = currentMsg;
    setConversation({
      conversationId,
      latestMessage: null,
    });
  };

  const onCompletion = (data: any, currentState: any, currentMsg: any) => {
    const { requestMessage, responseMessage } = data;
    const { conversationId } = requestMessage;
    const {
      messages,
      _currentMsg,
      message,
      isCustomModel,
      sender,
      isRegenerate,
    } = currentState;
    const { model, chatGptLabel, promptPrefix } = message;
    if (isRegenerate) setMessages([...messages, responseMessage]);
    else setMessages([...messages, requestMessage, responseMessage]);
    setSubmitting(false);

    const isBing = model === "bingai" || model === "sydney";

    // refresh title
    if (
      requestMessage.parentMessageId == "00000000-0000-0000-0000-000000000000"
    ) {
      setTimeout(() => {
        refreshConversation();
      }, 2000);

      // in case it takes too long.
      setTimeout(() => {
        refreshConversation();
      }, 5000);
    }

    if (
      !isBing &&
      convo.conversationId === null &&
      convo.parentMessageId === null
    ) {
      const { title } = data;
      const { conversationId, messageId } = responseMessage;
      setConversation({
        title,
        conversationId,
        parentMessageId: messageId,
        jailbreakConversationId: null,
        conversationSignature: null,
        clientId: null,
        invocationId: null,
        chatGptLabel: model === isCustomModel ? chatGptLabel : null,
        promptPrefix: model === isCustomModel ? promptPrefix : null,
        latestMessage: null,
      });
    } else if (model === "bingai") {
      console.log("Bing data:", data);
      const { title } = data;
      const {
        conversationSignature,
        clientId,
        conversationId,
        invocationId,
        parentMessageId,
      } = responseMessage;
      setConversation({
        title,
        parentMessageId,
        conversationSignature,
        clientId,
        conversationId,
        invocationId,
        latestMessage: null,
      });
    } else if (model === "sydney") {
      const { title } = data;
      const {
        jailbreakConversationId,
        parentMessageId,
        conversationSignature,
        clientId,
        conversationId,
        invocationId,
      } = responseMessage;
      setConversation({
        title,
        jailbreakConversationId,
        parentMessageId,
        conversationSignature,
        clientId,
        conversationId,
        invocationId,
        latestMessage: null,
      });
    }
  };

  const errorHandler = (data: any, currentState: any, currentMsg: any) => {
    const { initialResponse, messages, _currentMsg, message } = currentState;
    console.log("Error:", data);
    const errorResponse = {
      ...data,
      error: true,
      parentMessageId: currentMsg?.messageId,
    };
    setErrorMessage(data?.text);
    setSubmitting(false);
    setMessages([...messages, currentMsg, errorResponse]);
    setText(message?.text);
    setError(true);
    return;
  };

  const submitMessage = () => {
    createCompletion({ text });
  };

  useEffect(() => {
    // @ts-ignore
    inputRef.current?.focus();
    if (Object.keys(submission).length === 0) {
      return;
    }

    const currentState = submission;

    let currentMsg = { ...currentState.message };
    let latestResponseText = "";
    // @ts-ignore
    const { server, payload } = createPayload(submission);
    
    const onMessage = (e: any) => {
      if (stopStream) {
        return;
      }

      const data = JSON.parse(e.data);
      debugger;

      if (data.final) {
        onCompletion(data, currentState, currentMsg);
        toggleCursor();
        console.log("final", data);
      }
      if (data.created) {
        currentMsg = data.message;
        createdHandler(data, currentState, currentMsg);
      } else {
        let text = data.text || data.response;
        if (data.initial) {
          toggleCursor();
        }
        if (data.message) {
          latestResponseText = text;
          messageHandler(text, currentState, currentMsg);
        }
      }
    };

    // @ts-ignore
    const events = new SSE(server, {
      payload: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    events.onopen = function () {
      console.log("connection is opened");
    };

    events.onmessage = onMessage;

    events.oncancel = (e: any) => {
      toggleCursor(true);
      cancelHandler(latestResponseText, currentState, currentMsg);
    };

    events.onerror = function (e: any) {
      console.log("error in opening conn.");
      events.close();

      const data = JSON.parse(e.data);
      toggleCursor(true);
      errorHandler(data, currentState, currentMsg);
    };

    events.stream();

    return () => {
      events.removeEventListener("message", onMessage);
      toggleCursor(true);
      const isCancelled = events.readyState <= 1;
      events.close();
      if (isCancelled) {
        const e = new Event("cancel");
        events.dispatchEvent(e);
      }
    };
  }, [submission]);

  const handleRegenerate = () => {
    if (latestMessage && !latestMessage?.isCreatedByUser)
      regenerate(latestMessage);
  };

  const handleStopGenerating = () => {
    stopGenerating();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isComposing.current) submitMessage();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      return console.log("Enter + Shift");
    }

    if (isSubmitting) {
      return;
    }
  };

  const handleCompositionStart = (e: any) => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (e: any) => {
    isComposing.current = false;
  };

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    // if (isSubmitting && (value === '' || value === '\n')) {
    //   return;
    // }
    setText(value);
  };

  const isSearchView = messages?.[0]?.searchResult === true;
  const getPlaceholderText = () => {
    if (isSearchView) {
      return "Click a message title to open its conversation.";
    }

    if (disabled) {
      return "Choose another model or customize GPT again";
    }

    if (isNotAppendable) {
      return "Edit your message or Regenerate.";
    }

    return "";
  };

  return (
    <div className={styles.mainPromptContainer}>
      <form className={styles.promptForm}>
        <div className={styles.promptWrapper}>
          <span className={styles.regenerateContainer}>
            {isSubmitting && !isSearchView ? (
              <button
                onClick={handleStopGenerating}
                className="input-panel-button btn btn-neutral flex justify-center gap-2 border-0 md:border"
                type="button"
              >
                <StopGeneratingIcon />
                <span className="hidden md:block">Stop generating</span>
              </button>
            ) : latestMessage &&
              !latestMessage?.isCreatedByUser &&
              !isSearchView ? (
              <button
                onClick={handleRegenerate}
                className="input-panel-button btn btn-neutral flex justify-center gap-2 border-0 md:border"
                type="button"
              >
                <RegenerateIcon />
                <span className="hidden md:block">Regenerate response</span>
              </button>
            ) : null}
          </span>
          <div
            className={
              disabled ? styles.textareaWrapperDisabled : styles.textareaWrapper
            }
          >
            <ModelMenu />

            <InputTextarea
              tabIndex={0}
              autoFocus
              ref={inputRef}
              autoResize
              rows={1}
              value={disabled || isNotAppendable ? "" : text}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyDown}
              onChange={changeHandler}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={getPlaceholderText()}
              disabled={disabled || isNotAppendable}
              className={styles.inputTextarea}
              // className="m-0 h-auto max-h-52 resize-none overflow-auto border-0 bg-transparent p-0 pl-12 pr-8 leading-6 placeholder:text-sm placeholder:text-gray-600 focus:outline-none focus:ring-0 focus-visible:ring-0 dark:bg-transparent dark:placeholder:text-gray-500 md:pl-8"
            />
            <SubmitButton
              submitMessage={submitMessage}
              disabled={disabled || isNotAppendable}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
