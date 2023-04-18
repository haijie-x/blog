import ReactMarkdown from "react-markdown";
import { PrismAsyncLight } from "react-syntax-highlighter";
import oneDark from "../styles/one-dark";

const Markdown: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          code({ node, inline, className, children, ...props }) {
            // className: language-xxx  =>  xxx
            const language = className?.split("-")[1] || "";
            return (
              <PrismAsyncLight
                showLineNumbers={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style={oneDark as any}
                language={language}
                PreTag="div"
                {...props}
              >
                {String(children)}
              </PrismAsyncLight>
            );
          },
        }}
        linkTarget={"_blank"}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
