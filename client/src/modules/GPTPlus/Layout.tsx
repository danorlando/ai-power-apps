import { useState } from "react";
import { Sidebar, MobileNav } from "./components/Sidebar";
import { useConversationState, useProfileState } from "./contexts";
import styles from "./styles.module.css";

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
          <h1>Main</h1>
        </div>
      </section>
    </div>
  );
}

export default Layout;
