import {TrashIcon, CrossIcon} from '@common/icons';
import { useSetMessages, useSetSubmission, useSetNewConversation, useRemoveConversation } from '@modules/GPTPlus/contexts';
// import { useDeleteConversationMutation } from '@data-provider';

type TDeleteButtonProps = {
  conversationId: string;
  renaming: boolean;
  cancelHandler: () => void;
  retainView: () => void;
};

export default function DeleteButton({ conversationId, renaming, cancelHandler, retainView }: TDeleteButtonProps) {

  const setMessages = useSetMessages();
  const setSubmission = useSetSubmission();
  const setNewConvo = useSetNewConversation();
  const removeConvo = useRemoveConversation();

  // const deleteMutation = useDeleteConversationMutation();

  const clickHandler = () => {
    // deleteMutation.mutate({ conversationId });
    setMessages([]);
    removeConvo(conversationId);
    setNewConvo();
    setSubmission({});
    retainView();
  };

  const handler = renaming ? cancelHandler : clickHandler;

  return (
    <button
      className="p-1 hover:text-white"
      onClick={handler}
    >
      { renaming ? <CrossIcon/> : <TrashIcon />}
    </button>
  );
}
