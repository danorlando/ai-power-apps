import React from 'react';
import LinkEmbed from './LinkEmbed';
import Markdown from 'markdown-to-jsx';
import CopyCodeButton from './CopyCodeButton';
import CodeHighlight from './CodeHighlight';
import regexSplit from '@modules/GPTPlus/utils';
import { regexDictionary } from '@modules/GPTPlus/utils';

const { codeRegex, inLineRegex, markupRegex, languageMatch, newLineMatch } = regexDictionary;

const mdOptions = {
  wrapper: React.Fragment,
  forceWrapper: true,
  overrides: {
    a: {
      component: LinkEmbed,
    }
  }
};

const inLineWrap = (parts: any) => {
  let previousElement: React.ReactNode = null;
  return parts.map((part: any, i: number) => {
    if (part.match(markupRegex)) {
      const codeElement = <code key={i}>{part.slice(1, -1)}</code>;
      if (previousElement && typeof previousElement !== 'string') {
        // Append code element as a child to previous non-code element
        previousElement = (
          // @ts-ignore
          <Markdown
            options={mdOptions}
            key={i}
          >
            {previousElement}
            {codeElement}
          </Markdown>
        );
        return previousElement;
      } else {
        return codeElement;
      }
    } else {
      previousElement = part;
      return previousElement;
    }
  });
};

type TCompletionContainerProps = {
  text: any;
  generateCursor: () => void;
};

export default function CompletionContainer({ text, generateCursor }: TCompletionContainerProps) {
  let embedTest = false;
  let result = null;

  // to match unenclosed code blocks
  if (text.match(/```/g)?.length === 1) {
    embedTest = true;
  }

  // match enclosed code blocks
  if (text.match(codeRegex)) {
    const parts = regexSplit(text);
    // console.log(parts);
    const codeParts = parts.map((part: string, i) => {
      if (part.match(codeRegex)) {
        let language = 'javascript';
        let matched = false;

        if (part.match(languageMatch)) {
          language = part.match(languageMatch)![1].toLowerCase();
          part = part.replace(languageMatch, '```');
          matched = true;
          // highlight.js language validation
          // const validLanguage = languages.some((lang) => language === lang);
          // part = validLanguage ? part.replace(languageMatch, '```') : part;
          // language = validLanguage ? language : 'javascript';
        }

        part = part.replace(newLineMatch, '```');

        return (
          <CopyCodeButton
            key={i}
            language={language}
            code={part.slice(3, -3)}
            matched={matched}
          >
            <CodeHighlight
              language={language}
              code={part.slice(3, -3)}
            />
          </CopyCodeButton>
        );
      } else if (part.match(inLineRegex)) {
        const innerParts = part.split(inLineRegex);
        return inLineWrap(innerParts);
      } else {
        return (
          <Markdown
            options={mdOptions}
            key={i}
          >
            {part}
          </Markdown>
        );
      }
    });

    return <>{codeParts}</>; // return the wrapped text
  } else if (embedTest) {
    const language = text.match(/```(\w+)/)?.[1].toLowerCase() || 'javascript';
    const parts = text.split(text.match(/```(\w+)/)?.[0] || '```');
    const codeParts = parts.map((part: string, i: number) => {
      if (i === 1) {
        part = part.replace(/^\n+/, '');

        return (
          <CopyCodeButton
            key={i}
            language={language}
          >
            <CodeHighlight
              code={part}
              language={language}
            />
          </CopyCodeButton>
        );
      } else if (part.match(inLineRegex)) {
        const innerParts = part.split(inLineRegex);
        return inLineWrap(innerParts);
      } else {
        return (
          <Markdown
            options={mdOptions}
            key={i}
          >
            {part}
          </Markdown>
        );
      }
    });

    // return <>{codeParts}</>; // return the wrapped text
    result = <>{codeParts}</>;
  } else if (text.match(markupRegex)) {
    // map over the parts and wrap any text between tildes with <code> tags
    const parts = text.split(markupRegex);
    const codeParts = inLineWrap(parts);
    // return <>{codeParts}</>; // return the wrapped text
    result = <>{codeParts}</>;
  } else {
    // return <Markdown options={mdOptions}>{text}</Markdown>;
    result = <Markdown options={mdOptions}>{text}</Markdown>;
  }

  return (
    <>
    {result}
    {generateCursor()}
    </>
  );
}
