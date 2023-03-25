import React, { useEffect, useState, useRef, useCallback } from "react";
import {Spinner} from "@common/icons";
import { throttle } from "lodash";
import { CSSTransition } from "react-transition-group";
import ScrollButton from "./ScrollButton";
import ChatMulti from "./ChatMulti";
import {
  useConversationState,
  useCompletionState,
  usePlatformState,
} from "@modules/GPTPlus/contexts";

export type TChatContainerProps = {
  messages: any[];
  messageTree: any[];
};

function ChatContainer({ messages, messageTree }: TChatContainerProps) {
  const [currentEditId, setCurrentEditId] = useState<string | number>(-1);
  const { conversationId } = useConversationState();
  const { model, customModel } = useCompletionState();
  const { models } = usePlatformState();
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const scrollableRef = useRef(null);
  const messagesEndRef = useRef(null);

  const modelName = models.find((element) => element.model == model)?.name;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // @ts-ignore
      const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
      const diff = Math.abs(scrollHeight - scrollTop);
      const percent = Math.abs(clientHeight - diff) / clientHeight;
      const hasScrollbar = scrollHeight > clientHeight && percent > 0.2;
      setShowScrollButton(hasScrollbar);
    }, 650);

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [messages]);

  const scrollToBottom = useCallback(
    throttle(
      () => {
        console.log("scrollToBottom");
        // @ts-ignore
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowScrollButton(false);
      },
      750,
      { leading: true }
    ),
    [messagesEndRef]
  );

  const handleScroll = () => {
    // @ts-ignore
    const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
    const diff = Math.abs(scrollHeight - scrollTop);
    const percent = Math.abs(clientHeight - diff) / clientHeight;
    if (percent <= 0.2) {
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  };

  let timeoutId: any = null;
  const debouncedHandleScroll = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(handleScroll, 100);
  };

  const scrollClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollToBottom();
  };

  return (
    <div
      className="flex-1 overflow-y-auto pt-10 md:pt-0"
      ref={scrollableRef}
      onScroll={debouncedHandleScroll}
    >
      {/* <div className="flex-1 overflow-hidden"> */}
      <div className="dark:gpt-dark-gray h-full">
        <div className="dark:gpt-dark-gray flex h-full flex-col items-center text-sm">
          <div className="flex w-full items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-sm text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300">
            Model: {modelName} {customModel ? `(${customModel})` : null}
          </div>
          {messageTree.length === 0 ? (
            <Spinner />
          ) : (
            <>
              <ChatMulti
                key={conversationId} // avoid internal state mixture
                messageList={messageTree}
                messages={messages}
                scrollToBottom={scrollToBottom}
                currentEditId={currentEditId}
                setCurrentEditId={setCurrentEditId}
              />
              <CSSTransition
                in={showScrollButton}
                timeout={400}
                classNames="scroll-down"
                unmountOnExit={false}
                // appear
              >
                {() =>
                  showScrollButton && (
                    <ScrollButton onClick={(e) => scrollClickHandler(e)} />
                  )
                }
              </CSSTransition>
            </>
          )}
          <div
            className="dark:gpt-dark-gray group h-32 w-full flex-shrink-0 dark:border-gray-900/50 md:h-48"
            ref={messagesEndRef}
          />
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default ChatContainer;
