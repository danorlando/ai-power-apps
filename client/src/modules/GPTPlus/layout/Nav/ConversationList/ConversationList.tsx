import Conversation from './Conversation';
import { TConversation } from '@data-provider';

type TConversationListProps = {
  conversations: TConversation[];
  conversationId: string;
  moveToTop: () => void;
};


export default function ConversationList({ conversations, conversationId, moveToTop }: TConversationListProps) {

  return (
    <>
      {conversations &&
        conversations.length > 0 &&
        conversations.map((convo) => {
          const bingData = convo.conversationSignature
            ? {
                jailbreakConversationId: convo.jailbreakConversationId,
                conversationSignature: convo.conversationSignature,
                parentMessageId: convo.parentMessageId || null,
                clientId: convo.clientId,
                invocationId: convo.invocationId
              }
            : null;

          return (
            <Conversation
              key={convo.conversationId}
              id={convo.conversationId}
              platform={convo.model}
              parentMessageId={convo.parentMessageId}
              title={convo.title}
              conversationId={conversationId}
              chatGptLabel={convo.chatGptLabel}
              promptPrefix={convo.promptPrefix}
              bingData={bingData}
              retainView={moveToTop}
            />
          );
        })}
    </>
  );
}
