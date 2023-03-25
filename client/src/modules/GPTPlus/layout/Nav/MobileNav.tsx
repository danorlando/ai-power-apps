import { useConversationState } from "@modules/GPTPlus/contexts/ConversationContext";
import { TSidebarProps } from "./Sidebar";
import styles from "./styles.module.css";

function MobileNav({ visible, setSidebarVisible }: TSidebarProps) {
  const { conversationId, convos, title } = useConversationState();

  const toggleSidebarVisible = () => {
    setSidebarVisible(!visible);
  };

  const newConvo = () => {};

  return (
    <div className={styles.mobileNav}>
      <button
        type="button"
        className={styles.mobileNavButton}
        onClick={toggleSidebarVisible}
        aria-label="Open sidebar"
      >
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <h1 className="flex-1 text-center text-base font-normal">
        {title || "New Chat"}
      </h1>
      <button type="button" className="px-3" onClick={newConvo}>
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}

export default MobileNav;
