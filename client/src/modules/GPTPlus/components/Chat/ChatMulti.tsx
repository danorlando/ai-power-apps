import { useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';

export type TChatMultiProps = {
  messageList: any[] | undefined;
  messages: any[];
  scrollToBottom: () => void;
  currentEditId: string | number;
  setCurrentEditId: (id: string | number) => void;
};

export default function ChatMulti({
  messageList,
  messages,
  scrollToBottom,
  currentEditId,
  setCurrentEditId,
}: TChatMultiProps) {

  const [siblingIdx, setSiblingIdx] = useState(0);

  const setSiblingIdxRev = (value: number) => {
    setSiblingIdx(messageList?.length! - value - 1);
  };

  useEffect(() => {
    // reset siblingIdx when changes, mostly a new message is submitting.
    setSiblingIdx(0);
  }, [messageList?.length])

  // if (!messageList?.length) return null;
  if (!(messageList && messageList.length)) {
    return null;
  }

  if (siblingIdx >= messageList?.length) {
    setSiblingIdx(0);
    return null;
  }

  const message = messageList[messageList.length - siblingIdx - 1];
  return (
    <ChatMessage
      key={message.messageId}
      message={message}
      messages={messages}
      scrollToBottom={scrollToBottom}
      currentEditId={currentEditId}
      setCurrentEditId={setCurrentEditId}
      siblingIdx={messageList.length - siblingIdx - 1}
      siblingCount={messageList.length}
      setSiblingIdx={setSiblingIdxRev}
    />
  );
}
