import {
  UseQueryOptions,
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  QueryObserverResult,
} from "@tanstack/react-query";
import * as t from "./types";
import * as dataService from "./data-service";

export enum QueryKeys {
  getMessages = "getMessages",
  getConversations = "getConversations",
  getConversationById = "getConversationById",
  getOpenAIModels = "getOpenAIModels",
  getPlatforms = "getPlatforms",
  updateCustomGpt = "updateCustomGpt",
}

export const useGetMessagesByConvoId = (
  id: string
): QueryObserverResult<t.TGetMessagesResponse, unknown> => {
  return useQuery([QueryKeys.getMessages, id], () =>
    dataService.getMessages(id)
  );
};

export const useUpdateConvoMutation = (
  id: string
): UseMutationResult<
  t.TUpdateConversationResponse,
  unknown,
  t.TUpdateConversationRequest,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: t.TUpdateConversationRequest) =>
      dataService.updateConversation(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.getConversationById, id]);
      },
    }
  );
};

export const useUpdateCustomGptMutation = (): UseMutationResult<t.UpdateCustomGptResponse, unknown, t.UpdateCustomGptRequest, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((payload: t.UpdateCustomGptRequest) => dataService.updateCustomGpt(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.getPlatforms);
    },
  });
}
