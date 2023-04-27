import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import cn from "classnames";

const Markdown: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        // children={content}
        components={{
          a: (props) => <a {...props} className="text-main font-bold" />,
          h1: (props) => <h1 {...props} className="my-5 font-bold" />,
          h2: (props) => <h2 {...props} className="my-5 font-bold" />,
          h3: (props) => <h3 {...props} className="my-5 font-bold" />,
          h4: (props) => <h4 {...props} className="my-3 font-bold" />,
          h5: (props) => <h5 {...props} className="my-3 font-bold" />,
          h6: (props) => <h6 {...props} className="my-3 font-bold" />,
          p: (props) => <p {...props} className="my-3" />,
          ul: (props) => (
            <ul
              {...props}
              // ordered={props?.ordered ? true :false}
              className="list-inside list-disc"
            />
          ),
          ol: (props) => <ol {...props} className="list-inside list-disc" />,
          blockquote: (props) => (
            <blockquote
              {...props}
              className="my-5 border-l-4 pl-4 text-gray-500"
            />
          ),
          code({ node, style, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter language={match[1]} {...props} PreTag="div">
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className={cn(
                  className,
                  "bg-gray-100 px-1 rounded m-px decoration-clone"
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
