export const LOCAL_API_BASEURL = import.meta.env.VITE_API_LOCAL_SERVER_URL;

export const openAiModels = () => {
  return `${LOCAL_API_BASEURL}/api/open-ai-models`
}

export const getPlatforms = () => {
  return `${LOCAL_API_BASEURL}/api/models`
}

export const getAICompletion = () => {
  return `${LOCAL_API_BASEURL}/api/ask `
}

export const user = () => {
  return `${LOCAL_API_BASEURL}/api/me`
}

export const getMessages = (id: string) => {
  return `${LOCAL_API_BASEURL}/api/messages/${id}`
}

export const getConversations = (pageNumber: string) => {
  return `${LOCAL_API_BASEURL}/api/convos?pageNumber=${pageNumber}`
}

export const updateConversation = () => {
  return `${LOCAL_API_BASEURL}/api/convos/update`
}

export const prompts = () => {
  return `${LOCAL_API_BASEURL}/api/prompts`
}

export const customGpts = () => {
  return `${LOCAL_API_BASEURL}/api/customGpts`
}

// TODO: turn this into a DELETE instead of POST
export const deleteCustomGpt = (id: string) => {
  return `${LOCAL_API_BASEURL}/api/customGpts/delete`
}

export const generateTitle = () => {
  return `${LOCAL_API_BASEURL}/api/convos/gen_title`
}




