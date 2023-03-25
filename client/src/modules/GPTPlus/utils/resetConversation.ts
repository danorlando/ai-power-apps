import { TMessage } from '@data-provider';

export type TResetConversationProps = {
  messages: TMessage[];
  sender: string | null;
}

export default function resetConversation({messages, sender}: TResetConversationProps) {
  if (messages.length === 0) {
    return false;
  }
  let modelMessages = messages.filter((message) => !message.isCreatedByUser);
  let lastModel = modelMessages[modelMessages.length - 1].sender;
  if (lastModel !== sender) {
    console.log(
      'Model change! Reseting convo. Original messages: ',
      messages,
      'filtered messages: ',
      modelMessages,
      'last model: ',
      lastModel,
      'sender: ',
      sender
    );
    return true;
  }

  return false;
}
