import { useCompletionState, useConversationState } from "@modules/GPTPlus/contexts";
import styles from "./styles.module.css";
type TSubmitButtonProps = {
  submitMessage: () => void;
  disabled: boolean | undefined;
};

export default function SubmitButton({ submitMessage, disabled }: TSubmitButtonProps) {
  const { isSubmitting } = useCompletionState();
  const { error, latestMessage } = useConversationState();

  const clickHandler = (e : React.MouseEvent ) => {
    e.preventDefault();
    submitMessage();
  };

  if (isSubmitting) {
    return (
      <button
        className="absolute bottom-0 right-1 h-[100%] w-[30px] rounded-md p-1 text-gray-500 hover:bg-gray-100 disabled:hover:bg-transparent dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:disabled:hover:bg-transparent md:right-2"
        disabled
      >
        <div className="text-2xl">
          <span>·</span>
          <span className="blink">·</span>
          <span className="blink2">·</span>
        </div>
      </button>
    );
  }
  return (
    <button
      onClick={clickHandler}
      disabled={disabled}
      className={styles.submitButton}
    >
      <div className={disabled ? styles.submitButtonInnerDisabled : styles.submitButtonInner}>
      {/* <div className="m-1 mr-0 rounded-md p-2 pt-[10px] pb-[10px] group-hover:bg-gray-100 group-disabled:hover:bg-transparent dark:group-hover:bg-gray-900 dark:group-hover:text-gray-400 dark:group-disabled:hover:bg-transparent"> */}
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1 h-4 w-4 "
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="22"
            y1="2"
            x2="11"
            y2="13"
          />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </div>
    </button>
  );
}

{
  /* <div class="text-2xl"><span class="">·</span><span class="">·</span><span class="invisible">·</span></div> */
}
