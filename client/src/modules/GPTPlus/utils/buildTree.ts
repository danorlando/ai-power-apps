import type { TMessage } from "@data-provider/types";

export default function buildTree(messages: TMessage[]) {
  let messageMap: any = {};
  let rootMessages: [] = [];

  // Traverse the messages array and store each element in messageMap.
  messages.forEach((message) => {
    messageMap[message.messageId] = { ...message, children: [] };

    const parentMessage = messageMap[message.parentMessageId];
    if (parentMessage)
      parentMessage.children.push(messageMap[message.messageId]);
      // @ts-ignore
    else rootMessages.push(messageMap[message.messageId]);
  });

  return rootMessages;
}
