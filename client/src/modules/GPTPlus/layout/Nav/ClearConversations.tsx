import { useEffect } from 'react';
import TrashIcon from '@common/icons/TrashIcon';
import { useSetNewConversation, useRemoveAll, useSetMessages, useSetSubmission } from '@modules/GPTPlus/contexts';

import { Dialog, DialogModal, DialogTrigger } from '@common/components';
import {useClearConversationsMutation} from '@data-provider';

export default function ClearConvos() {

  const clearConversationsMutation = useClearConversationsMutation();
  const setNewConvo = useSetNewConversation();
  const removeAll = useRemoveAll();
  const setMessages = useSetMessages();
  const setSubmission = useSetSubmission();
  
  useEffect(() => {
    if (clearConversationsMutation.isSuccess) {
      console.log('Cleared conversations');
      setMessages([]);
      setNewConvo();
      setSubmission({});
    }
   }, [clearConversationsMutation.isSuccess]);

  const clickHandler = () => {
    console.log('Clearing conversations...');
    removeAll();
    clearConversationsMutation.mutate({});
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
    <a
      className="flex cursor-pointer items-center gap-3 rounded-md py-3 px-3 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10"
      // onClick={clickHandler}
    >
      <TrashIcon />
      Clear conversations
    </a>
    </DialogTrigger>
    <DialogModal
      title="Clear conversations"
      description="Are you sure you want to clear all conversations? This is irreversible."
      selection={{
        selectHandler: clickHandler,
        selectClasses: 'bg-red-600 hover:bg-red-700 dark:hover:bg-red-800 text-white',
        selectText: 'Clear',
      }}
    />
    </Dialog>
  );
}
