import { useState } from "react";
import { Sidebar, MobileNav } from "./Nav";
import { useConversationState, useProfileState } from "../contexts";
import styles from "./styles.module.css";
import ChatMessage from '@modules/GPTPlus/components/Chat/ChatMessage';
import ChatInput from "@modules/GPTPlus/components/Chat/ChatInput";

function Layout() {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const { user } = useProfileState();

  // todo: add call to get user from user service

  //todo: add mobile nav
  return (
    <div className="flex h-screen">
      <Sidebar visible={sidebarVisible} setSidebarVisible={setSidebarVisible} />
      <section className={styles.chatSection}>
        <div className={styles.chatContainer}>
          <MobileNav
            visible={sidebarVisible}
            setSidebarVisible={setSidebarVisible}
          />
          <ChatMessage messages={messages} messageTree={messageTree}/>
          <ChatInput />
        </div>
      </section>
    </div>
  );
}

export default Layout;
