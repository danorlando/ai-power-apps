import React from "react";
import CompletionContainer from "./CompletionContainer";
import Completion from "./Completion";

type TContentContainerProps = {
  text: string;
  generateCursor: () => void;
  isCreatedByUser: boolean;
  searchResult: boolean;
};

const ContentContainer = React.memo(
  // @ts-ignore
  ({ text, generateCursor, isCreatedByUser, searchResult }: any) => {
    if (!isCreatedByUser && searchResult) {
      return <Completion content={text} />;
    } else if (!isCreatedByUser && !searchResult) {
      return (
        <CompletionContainer text={text} generateCursor={generateCursor} />
      );
    } else if (isCreatedByUser) {
      return <>{text}</>;
    }
  }
);

export default ContentContainer;
