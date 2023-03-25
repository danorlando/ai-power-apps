import React, { useState, useEffect } from 'react';
import Highlighter from 'react-highlight';
import hljs from 'highlight.js';

type TCodeHighlightProps = {
  language: string;
  code: string;
};

const CodeHighlight = React.memo(({ language, code }: TCodeHighlightProps) => {
  const [highlightedCode, setHighlightedCode] = useState(code);
  const lang = language ? language : 'javascript';

  useEffect(() => {
    setHighlightedCode(hljs.highlight(code, { language: lang }).value);
  }, [code, lang]);

  return (
    <pre>
      {!highlightedCode ? (
        // <code className={`hljs !whitespace-pre language-${lang ? lang: 'javascript'}`}>
        <Highlighter className={`hljs !whitespace-pre language-${lang ? lang : 'javascript'}`}>
          {code}
        </Highlighter>
      ) : (
        <code
          className={`hljs language-${lang}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      )}
    </pre>
  );
});

export default CodeHighlight;

