import { useState, useEffect, useRef, useCallback } from "react";
import ContentContainer from "../Content/ContentContainer";
import ChatMulti from "./ChatMulti";
import HoverButtons from "./HoverButtons";
import SiblingSwitch from "./SiblingSwitch";
import {
  useSetConversation,
  useSetLatestMessage,
  useSetModel,
  useSetCustomModel,
  useSetCustomGpt,
  useToggleCursor,
  useSetDisabled,
  useSetMessages,
  useCompletionState,
} from "@modules/GPTPlus/contexts";
import { getAvatar } from "./Avatar";
import { useSubmitMesssage } from "@modules/GPTPlus/hooks/useSubmitMessage";
import { TMessage, getConversationById } from "@data-provider";

export type TChatMessageProps = {
  message: TMessage;
  messages: TMessage[];
  scrollToBottom: () => void;
  currentEditId: string | number;
  setCurrentEditId: (id: string | number) => void;
  siblingIdx: number;
  siblingCount: number;
  setSiblingIdx: (value: number) => void;
};

function ChatMessage({
  message,
  messages,
  scrollToBottom,
  currentEditId,
  setCurrentEditId,
  siblingIdx,
  siblingCount,
  setSiblingIdx,
}: TChatMessageProps) {
  const { isSubmitting, model, chatGptLabel, cursor, promptPrefix } =
    useCompletionState();
  const [abortScroll, setAbort] = useState(false);
  const { sender, text, searchResult, isCreatedByUser, error, submitting } =
    message;
  const textEditor = useRef(null);
  // const { convos } = useSelector((state) => state.convo);
  // @ts-ignore
  const last = !message?.children?.length;
  const edit = message.messageId == currentEditId;
  const { createCompletion } = useSubmitMesssage();
  const setConversation = useSetConversation();
  const setLatestMessage = useSetLatestMessage();
  const setModel = useSetModel();
  const setCustomModel = useSetCustomModel();
  const setCustomGpt = useSetCustomGpt();
  const setCursor = useToggleCursor();
  const setDisabled = useSetDisabled();
  const setMessages = useSetMessages();

  // const notUser = !isCreatedByUser; // sender.toLowerCase() !== 'user';
  // const blinker = submitting && isSubmitting && last && !isCreatedByUser;
  const blinker = submitting && isSubmitting;
  const generateCursor = useCallback(() => {
    if (!blinker || !cursor) {
      return "";
    }

    return <span className="result-streaming">█</span>;
  }, [blinker, cursor]);

  useEffect(() => {
    if (blinker && !abortScroll) {
      scrollToBottom();
    }
  }, [isSubmitting, blinker, text, scrollToBottom]);

  useEffect(() => {
    if (last) {
      // TODO: stop using conversation.parentMessageId and remove it.
      setConversation({ parentMessageId: message?.messageId });
      setLatestMessage({ ...message });
    }
  }, [last, message]);

  const enterEdit = (cancel?: boolean) => {
    if (cancel) {
      setCurrentEditId("");
    } else {
      setCurrentEditId(message.messageId!);
    }
  };

  const handleWheel = () => {
    if (blinker) {
      setAbort(true);
    } else {
      setAbort(false);
    }
  };

  const props = {
    className:
      "w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 bg-white dark:text-gray-100 group dark:bg-gray-800",
  };

  const icon = getAvatar({
    sender,
    isCreatedByUser,
    model: model,
    searchResult,
    chatGptLabel,
    promptPrefix,
    error,
  });

  if (!isCreatedByUser)
    props.className =
      "w-full border-b border-black/10 bg-gray-50 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-100 dark:bg-[#444654]";

  if (message.bgColor && searchResult) {
    props.className = message.bgColor + " cursor-pointer";
  }

  // const wrapText = (text) => <TextWrapper text={text} generateCursor={generateCursor}/>;

  const resubmitMessage = () => {
    // @ts-ignore
    const text = textEditor.current.innerText;

    createCompletion({
      text,
      parentMessageId: message?.parentMessageId,
      conversationId: message?.conversationId,
    });

    setSiblingIdx(siblingCount - 1);
    enterEdit(true);
  };

  const clickSearchResult = async () => {
    if (!searchResult) return;
    setMessages([]);
    // todo: use RQ
    const convoResponse = await getConversationById(message.conversationId);
    const convo = convoResponse.data;

    if (convo?.chatGptLabel) {
      setModel("chatgptCustom");
      setCustomModel(convo.chatGptLabel.toLowerCase());
    } else {
      setModel(convo.model);
      setCustomModel(null);
    }

    setCustomGpt(convo);
    setConversation(convo);

    // TODO: use RQ
    // const { data } = await fetchById("messages", message.conversationId);
    // setMessages(data);
    setDisabled(false);
  };

  return (
    <>
      <div {...props} onWheel={handleWheel} onClick={clickSearchResult}>
        <div className="relative m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
          <div className="relative flex h-[30px] w-[30px] flex-col items-end text-right text-xs md:text-sm">
            {/* @ts-ignore */}
            {typeof icon === "string" && icon.match(/[^\u0000-\u007F]+/) ? (
              <span className=" direction-rtl w-40 overflow-x-scroll">
                {icon}
              </span>
            ) : (
              icon
            )}
            <div className="sibling-switch invisible absolute left-0 top-2 -ml-4 flex -translate-x-full items-center justify-center gap-1 text-xs group-hover:visible">
              <SiblingSwitch
                siblingIdx={siblingIdx}
                siblingCount={siblingCount}
                setSiblingIdx={setSiblingIdx}
              />
            </div>
          </div>
          <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 whitespace-pre-wrap md:gap-3 lg:w-[calc(100%-115px)]">
            <div className="flex flex-grow flex-col gap-3">
              {error ? (
                <div className="flex min-h-[20px] flex-grow flex-col items-start gap-4 gap-2 whitespace-pre-wrap text-red-500">
                  <div className="rounded-md border border-red-500 bg-red-500/10 py-2 px-3 text-sm text-gray-600 dark:text-gray-100">
                    {`An error occurred. Please try again in a few moments.\n\nError message: ${text}`}
                  </div>
                </div>
              ) : edit ? (
                <div className="flex min-h-[20px] flex-grow flex-col items-start gap-4 whitespace-pre-wrap">
                  {/* <div className={`${blinker ? 'result-streaming' : ''} markdown prose dark:prose-invert light w-full break-words`}> */}

                  <div
                    className="markdown prose dark:prose-invert light w-full break-words border-none focus:outline-none"
                    contentEditable={true}
                    ref={textEditor}
                    suppressContentEditableWarning={true}
                  >
                    {text}
                  </div>
                  <div className="mt-2 flex w-full justify-center text-center">
                    <button
                      className="btn btn-primary relative mr-2"
                      disabled={isSubmitting}
                      onClick={resubmitMessage}
                    >
                      Save & Submit
                    </button>
                    <button
                      className="btn btn-neutral relative"
                      onClick={() => enterEdit(true)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[20px] flex-grow flex-col items-start gap-4 whitespace-pre-wrap">
                  {/* <div className={`${blinker ? 'result-streaming' : ''} markdown prose dark:prose-invert light w-full break-words`}> */}
                  <div className="markdown prose dark:prose-invert light w-full break-words">
                    <ContentContainer
                      text={text}
                      generateCursor={generateCursor}
                      isCreatedByUser={isCreatedByUser}
                      searchResult={searchResult}
                    />
                  </div>
                </div>
              )}
            </div>
            <HoverButtons
              model={model}
              visible={!error && isCreatedByUser && !edit && !searchResult}
              onClick={() => enterEdit()}
            />
            <div className="sibling-switch-container flex justify-between">
              <div className="flex items-center justify-center gap-1 self-center pt-2 text-xs">
                <SiblingSwitch
                  siblingIdx={siblingIdx}
                  siblingCount={siblingCount}
                  setSiblingIdx={setSiblingIdx}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatMulti
        messageList={message.children}
        messages={messages}
        scrollToBottom={scrollToBottom}
        currentEditId={currentEditId}
        setCurrentEditId={setCurrentEditId}
      />
    </>
  );
}

export default ChatMessage;
