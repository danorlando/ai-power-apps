import { RegenerateIcon } from "@common/icons";

export type TRegenerateProps = {
  submitMessage: () => void;
  tryAgain: () => void;
  errorMessage: string;
};

export default function Regenerate({ submitMessage, tryAgain, errorMessage }: TRegenerateProps) {
  const clickHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    submitMessage();
  };

  return (
    <>
      <span className="mb-2 block justify-center text-xs text-black dark:text-white/50 md:mb-2">
        There was an error generating a response
      </span>
      <span className="m-auto flex justify-center">
        {!errorMessage.includes("short") && (
          <button
            onClick={clickHandler}
            className="btn btn-primary m-auto flex justify-center gap-2"
          >
            <RegenerateIcon />
            Regenerate response
          </button>
        )}
        <button
          onClick={tryAgain}
          className="btn btn-neutral flex justify-center gap-2 border-0 md:border"
        >
          <RegenerateIcon />
          Try another message
        </button>
      </span>
    </>
  );
}
