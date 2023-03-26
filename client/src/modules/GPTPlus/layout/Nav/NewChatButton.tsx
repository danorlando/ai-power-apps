import styles from "./styles.module.css";
import {
  useSetNewConversation,
  useRefreshConversation,
  useSetMessages,
  useSetDisabled,
  useSetText,
  useSetInputValue,
  useSetSearchQuery,
  useSetSubmission,
} from "@modules/GPTPlus/contexts";

function NewChatButton() {
  const setNewConversation = useSetNewConversation();
  const refreshConversation = useRefreshConversation();
  const setMessages = useSetMessages();
  const setDisabled = useSetDisabled();
  const setText = useSetText();
  const setInputValue = useSetInputValue();
  const setSearchQuery = useSetSearchQuery();
  const setSubmission = useSetSubmission();

  const clickHandler = () => {
    setText("");
    setMessages([]);
    setNewConversation();
    refreshConversation();
    setSubmission([]);
    setDisabled(false);
    setInputValue("");
    setSearchQuery("");
  };

  return (
    <a className={styles.newChatButton} onClick={clickHandler}>
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span>New chat</span>
    </a>
  );
}

export default NewChatButton;
