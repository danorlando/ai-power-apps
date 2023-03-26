import {
  ConversationProvider,
  CompletionProvider,
  MessageProvider,
  ProfileProvider,
  ModelProvider,
  TextProvider,
  ThemeProvider,
  SearchProvider
} from "./contexts";
import Layout from "./layout/Layout";

function GPTPlus() {
  return (
    <ProfileProvider>
      <ModelProvider>
        <SearchProvider>
        <ConversationProvider>
          <MessageProvider>
            <CompletionProvider>
              <TextProvider>
                <ThemeProvider>
                  <Layout />
                </ThemeProvider>
              </TextProvider>
            </CompletionProvider>
          </MessageProvider>
        </ConversationProvider>
        </SearchProvider>
      </ModelProvider>
    </ProfileProvider>
  );
}

export default GPTPlus;
