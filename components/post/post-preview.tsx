import DateFormatter from "../date-formatter";
import CoverImage from "../cover-image";
import Link from "next/link";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  slug: string;
};

const PostPreview = ({ title, coverImage, date, excerpt, slug }: Props) => {
  return (
    <div>
      <div className="text-xl mb-1 font-medium leading-snug">
        <Link
          as={`/posts/${slug}`}
          href="/posts/[slug]"
          className="hover:underline"
        >
          {title}
        </Link>
      </div>
      <div className="text-xs mb-6">
        <DateFormatter dateString={date} />
      </div>
    </div>
  );
};

export default PostPreview;
