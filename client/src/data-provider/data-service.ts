import * as t from "./types";
import request from "./request";
import * as endpoints from "./endpoints";

export function getOpenAIModels(): Promise<t.TOpenAIModels> {
  return request.get(endpoints.openAiModels());
}

export function postAICompletion(
  payload: t.TAICompletionRequest
) {
  return request.post(endpoints.getAICompletion(), payload);
}

export function getConversations(
  pageNumber: string
): Promise<t.TGetConversationsResponse> {
  return request.get(endpoints.getConversations(pageNumber));
}

export function getMessages(id: string): Promise<t.TMessage[]> {
  return request.get(endpoints.getMessages(id));
}



