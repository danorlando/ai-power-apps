export const LOCAL_API_BASEURL = import.meta.env.VITE_API_LOCAL_SERVER_URL;

export const openAiModels = () => {
  return `${LOCAL_API_BASEURL}/api/open-ai-models`;
};

export const getModels = () => {
  return `${LOCAL_API_BASEURL}/api/models`;
};

export const getAICompletion = () => {
  return `${LOCAL_API_BASEURL}/api/ask `;
};

export const user = () => {
  return `${LOCAL_API_BASEURL}/api/me`;
};

export const getMessages = (id: string) => {
  return `${LOCAL_API_BASEURL}/api/messages/${id}`;
};

export const getConversations = (pageNumber: string) => {
  return `${LOCAL_API_BASEURL}/api/convos?pageNumber=${pageNumber}`;
};

export const getConversationById = (id: string) => {
  return `${LOCAL_API_BASEURL}/api/convos/${id}`;
};

export const updateConversation = () => {
  return `${LOCAL_API_BASEURL}/api/convos/update`;
};

export const deleteConversation = () => {
  return `${LOCAL_API_BASEURL}/api/convos/clear`;
};

export const prompts = () => {
  return `${LOCAL_API_BASEURL}/api/prompts`;
};

export const customGpts = () => {
  return `${LOCAL_API_BASEURL}/api/customGpts`;
};

// TODO: turn this into a DELETE instead of POST
export const deleteCustomGpt = () => {
  return `${LOCAL_API_BASEURL}/api/customGpts/delete`;
};

export const generateTitle = () => {
  return `${LOCAL_API_BASEURL}/api/convos/gen_title`;
};

export const search = (q: string, pageNumber: string) => {
  return `${LOCAL_API_BASEURL}/api/search?q=${q}&pageNumber=${pageNumber}`;
}
