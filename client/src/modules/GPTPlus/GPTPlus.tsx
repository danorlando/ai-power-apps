import React, { useEffect, useState } from "react";
import {
  ConversationProvider,
  CompletionProvider,
  MessageProvider,
  ProfileProvider,
  PlatformProvider,
  TextProvider,
} from "./contexts";
import Layout from "./Layout";

function GPTPlus() {
  return (
    <ProfileProvider>
      <PlatformProvider>
        <ConversationProvider>
          <MessageProvider>
            <CompletionProvider>
              <TextProvider>
                <Layout />
              </TextProvider>
            </CompletionProvider>
          </MessageProvider>
        </ConversationProvider>
      </PlatformProvider>
    </ProfileProvider>
  );
}

export default GPTPlus;