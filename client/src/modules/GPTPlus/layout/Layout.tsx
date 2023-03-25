import { useState, useEffect } from "react";
import { Sidebar, MobileNav } from "./Nav";
import { useConversationState, useProfileState, useMessageState } from "../contexts";
import styles from "./styles.module.css";
import ChatContainer from '@modules/GPTPlus/components/Chat/ChatContainer';
import PromptInput from "@modules/GPTPlus/components/Chat/PromptInput";

function Layout() {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const { user } = useProfileState();
  const { title } = useConversationState();
  // todo: add call to get user from user service
  
  useEffect(() => {
    document.title = title;
  }, [title]);

  const { messages, messageTree } = useMessageState();
  
  return (
    <div className="flex h-screen">
      <Sidebar visible={sidebarVisible} setSidebarVisible={setSidebarVisible} />
      <section className={styles.chatSection}>
        <div className={styles.chatContainer}>
          <MobileNav
            visible={sidebarVisible}
            setSidebarVisible={setSidebarVisible}
          />
          <ChatContainer messages={messages} messageTree={messageTree}/>
          <PromptInput messages={messages}/>
        </div>
      </section>
    </div>
  );
}

export default Layout;
