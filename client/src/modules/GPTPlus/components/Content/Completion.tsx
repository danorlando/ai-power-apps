import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import { langSubset } from "@common/utils";
import CodeBlock from "./CodeBlock";

const Completion = React.memo(({ content }: { content: any }) => {
  return (
    <>
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          [remarkMath, { singleDollarTextMath: false }],
        ]}
        rehypePlugins={[
          [rehypeKatex, { output: "mathml" }],
          [
            rehypeHighlight,
            {
              detect: true,
              ignoreMissing: true,
              subset: langSubset,
            },
          ],
        ]}
        linkTarget="_new"
        components={{
          // @ts-ignore
          code,
          p,
        }}
      >
        {content}
      </ReactMarkdown>
    </>
  );
});

type TcodeProps = {
  inline: boolean;
  className: string;
  children: any;
};
const code = React.memo((props: TcodeProps) => {
  const { inline, className, children } = props;
  const match = /language-(\w+)/.exec(className || "");
  const lang = match && match[1];

  if (inline) {
    return <code className={className}>{children}</code>;
  } else {
    return <CodeBlock lang={lang || "text"} codeChildren={children} />;
  }
});

type TpProps = { children: any };

const p = React.memo((props: TpProps) => {
  return <p className="whitespace-pre-wrap ">{props?.children}</p>;
});

type TblinkerProps = {
  node: any;
};
const blinker = ({ node }: TblinkerProps) => {
  if (node.type === "text" && node.value === "█") {
    return <span className="result-streaming">{node.value}</span>;
  }

  return null;
};

/* @ts-ignore */
// const em = React.memo(({ node, ...props }) => {
//   if (
//     props.children[0] &&
//     typeof props.children[0] === "string" &&
//     props.children[0].startsWith("^")
//   ) {
//     return <sup>{props.children[0].substring(1)}</sup>;
//   }
//   if (
//     props.children[0] &&
//     typeof props.children[0] === "string" &&
//     props.children[0].startsWith("~")
//   ) {
//     return <sub>{props.children[0].substring(1)}</sub>;
//   }
//   return <i {...props} />;
// });

 export default Completion;
