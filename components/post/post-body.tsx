import dynamic from "next/dynamic";
import { memo } from "react";
import markdownStyles from "./styles/markdown-styles.module.css";
import Markdown from "../markdown";

type Props = {
  content: string;
};

const PostBody = ({ content }: Props) => {
  return (
    <div className="max-w-2xl mx-auto overflow-auto">
      <Markdown content={content} />
    </div>
  );
};

export default PostBody;
