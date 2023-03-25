import React, { useEffect, useState } from "react";
import {
  ConversationProvider,
  CompletionProvider,
  MessageProvider,
  ProfileProvider,
  ModelProvider,
  TextProvider,
} from "./contexts";
import Layout from "./layout/Layout";

function GPTPlus() {
  return (
    <ProfileProvider>
      <ModelProvider>
        <ConversationProvider>
          <MessageProvider>
            <CompletionProvider>
              <TextProvider>
                <Layout />
              </TextProvider>
            </CompletionProvider>
          </MessageProvider>
        </ConversationProvider>
      </ModelProvider>
    </ProfileProvider>
  );
}

export default GPTPlus;
