import { useState, useRef } from "react";
import RenameButton from "../../../components/common/RenameButton";
import DeleteButton from "../../../components/common/DeleteButton";
import { ConvoIcon } from "@common/icons";
import {
  useSetConversation,
  useSetSubmission,
  useSetStopStream,
  useSetCustomGpt,
  useSetModel,
  useSetCustomModel,
  useSetMessages,
  useSetEmptyMessage,
  useSetText,
  useRefreshConversation,
  useModelState,
  useCompletionState,
} from "@modules/GPTPlus/contexts";
import {
  useUpdateConvoMutation,
  useGetMessagesByConvoId,
} from "@data-provider";

type TConversationProps = {
  id: string;
  model: string;
  parentMessageId: string;
  conversationId: string;
  title: string;
  chatGptLabel: string | null;
  promptPrefix: string | null;
  bingData: any;
  retainView: () => void;
};
export default function Conversation({
  id,
  model,
  parentMessageId,
  conversationId,
  title,
  chatGptLabel = null,
  promptPrefix = null,
  bingData,
  retainView,
}: TConversationProps) {
  const setConversation = useSetConversation();
  const setSubmission = useSetSubmission();
  const setStopStream = useSetStopStream();
  const setCustomGpt = useSetCustomGpt();
  const setModel = useSetModel();
  const setCustomModel = useSetCustomModel();
  const setMessages = useSetMessages();
  const setEmptyMessage = useSetEmptyMessage();
  const setText = useSetText();
  const refreshConversation = useRefreshConversation();
  const { modelMap } = useModelState();
  const { stopStream } = useCompletionState();

  const [renaming, setRenaming] = useState(false);
  const [titleInput, setTitleInput] = useState(title);
  const inputRef = useRef(null);

  const messagesQuery = useGetMessagesByConvoId(id);
  const updateConvoMutation = useUpdateConvoMutation(id);

  const onConversationSelected = async () => {
    if (conversationId === id) {
      return;
    }

    if (!stopStream) {
      setStopStream(true);
      setSubmission({});
    }
    setEmptyMessage();

    const conversation = {
      title,
      error: false,
      conversationId: id,
      chatGptLabel,
      promptPrefix,
    };

    if (bingData) {
      const {
        parentMessageId,
        conversationSignature,
        jailbreakConversationId,
        clientId,
        invocationId,
      } = bingData;
      setConversation({
        ...conversation,
        parentMessageId,
        jailbreakConversationId,
        conversationSignature,
        clientId,
        invocationId,
        latestMessage: null,
      });
    } else {
      setConversation({
        ...conversation,
        parentMessageId,
        jailbreakConversationId: null,
        conversationSignature: null,
        clientId: null,
        invocationId: null,
        latestMessage: null,
      });
    }

    if (chatGptLabel) {
      setModel("chatgptCustom");
      setCustomModel(chatGptLabel.toLowerCase());
    } else {
      setModel(model);
      setCustomModel(null);
    }

    // if (modelMap[chatGptLabel.toLowerCase()]) {
    //   console.log('custom model', chatGptLabel);
    //   dispatch(setCustomModel(chatGptLabel.toLowerCase()));
    // } else {
    //   dispatch(setCustomModel(null));
    // }

    //@ts-ignore
    setMessages(messagesQuery.data);
    setCustomGpt(conversation);
    setText("");
    setStopStream(false);
  };

  const renameHandler = () => {
    setTitleInput(title);
    setRenaming(true);
    setTimeout(() => {
      // @ts-ignore
      inputRef.current.focus();
    }, 25);
  };

  const cancelHandler = () => {
    setRenaming(false);
  };

  const onRename = () => {
    setRenaming(false);
    if (titleInput === title) {
      return;
    }
    //note: check if refreshConversation is needed because mutation will refetch queries on success
    updateConvoMutation.mutate({ arg: { title: titleInput } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onRename();
    }
  };

  const aProps = {
    className:
      "animate-flash group relative flex cursor-pointer items-center gap-3 break-all rounded-md bg-gray-800 py-3 px-3 pr-14 hover:bg-gray-800",
  };

  if (conversationId !== id) {
    aProps.className =
      "group relative flex cursor-pointer items-center gap-3 break-all rounded-md py-3 px-3 hover:bg-[#2A2B32] hover:pr-4";
  }

  return (
    <a onClick={() => onConversationSelected()} {...aProps}>
      <ConvoIcon />
      <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis break-all">
        {renaming === true ? (
          <input
            ref={inputRef}
            type="text"
            className="m-0 mr-0 w-full border border-blue-500 bg-transparent p-0 text-sm leading-tight outline-none"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={onRename}
            onKeyDown={handleKeyDown}
          />
        ) : (
          title
        )}
      </div>
      {conversationId === id ? (
        <div className="visible absolute right-1 z-10 flex text-gray-300">
          <RenameButton
            renaming={renaming}
            renameHandler={renameHandler}
            onRename={onRename}
          />
          <DeleteButton
            conversationId={id}
            renaming={renaming}
            cancelHandler={cancelHandler}
            retainView={retainView}
          />
        </div>
      ) : (
        <div className="absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]" />
      )}
    </a>
  );
}
