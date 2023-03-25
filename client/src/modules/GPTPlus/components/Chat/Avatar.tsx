import { BingIcon, GPTIcon } from "@common/icons";

type TAvatarProps = {
  size?: number;
  sender: string;
  isCreatedByUser: boolean;
  searchResult?: string[];
  model?: string | null;
  chatGptLabel?: string | null;
  error: boolean;
  className?: string;
  isButton?: boolean;
  promptPrefix?: string | null;
};

export const getAvatar = ({
  size = 30,
  sender,
  isCreatedByUser,
  searchResult,
  model,
  chatGptLabel,
  error,
  className = "",
  isButton = false,
  promptPrefix
}: TAvatarProps) => {
  // 'ai' is used as 'model' is not accurate for search results
  let ai = searchResult ? sender : model;
  const bgColors = {
    chatgpt: `rgb(16, 163, 127${isButton ? ", 0.75" : ""})`,
    chatgptBrowser: `rgb(25, 207, 207${isButton ? ", 0.75" : ""})`,
    bingai: "transparent",
    sydney: "radial-gradient(circle at 90% 110%, #F0F0FA, #D0E0F9)",
    chatgptCustom: `rgb(0, 163, 255${isButton ? ", 0.75" : ""})`,
  };

  if (isCreatedByUser)
    return (
      <div
        title="User"
        style={{
          background:
            "radial-gradient(circle at 90% 110%, rgb(1 43 128), rgb(17, 139, 161))",
          color: "white",
          fontSize: 12,
          width: size,
          height: size,
        }}
        className={
          `relative flex items-center justify-center rounded-sm text-white ` +
          className
        }
      >
        User
      </div>
    );
  else if (!isCreatedByUser) {
    // TODO: use model from convo, rather than submit
    // const { model, chatGptLabel, promptPrefix } = convo;
    // @ts-ignore
    let background = bgColors[ai];
    const isBing = ai === "bingai" || ai === "sydney";

    return (
      <div
        // @ts-ignore
        title={chatGptLabel || ai}
        style={{
          background:
            background ||
            "radial-gradient(circle at 90% 110%, #F0F0FA, #D0E0F9)",
          width: size,
          height: size,
        }}
        className={
          `relative flex items-center justify-center rounded-sm text-white ` +
          className
        }
      >
        {isBing ? (
          <BingIcon size={size * 0.7} />
        ) : (
          <GPTIcon size={size * 0.7} />
        )}
        {error && (
          <span className="absolute right-0 top-[20px] -mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-red-500 text-[10px] text-white">
            !
          </span>
        )}
      </div>
    );
  } else
    return (
      <div
        title="User"
        style={{
          background:
            "radial-gradient(circle at 90% 110%, rgb(1 43 128), rgb(17, 139, 161))",
          color: "white",
          fontSize: 12,
          width: size,
          height: size,
        }}
        className={
          `relative flex items-center justify-center rounded-sm p-1 text-white ` +
          className
        }
      >
        {chatGptLabel}
      </div>
    );
};
