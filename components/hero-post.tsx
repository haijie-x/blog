import DateFormatter from "./date-formatter";
import CoverImage from "./cover-image";
import Link from "next/link";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  slug: string;
};

const HeroPost = ({ title, coverImage, date, excerpt, slug }: Props) => {
  return (
    <section>
      <div className="mb-4">
        <CoverImage title={title} src={coverImage} slug={slug} />
      </div>
      <h3 className="text-xl mb-2 leading-tight break-all">
        <Link
          as={`/posts/${slug}`}
          href="/posts/[slug]"
          className="hover:underline"
        >
          {title}
        </Link>
      </h3>
      <p className="text-l leading-relaxed mb-2 break-all font-light">
        {excerpt}
      </p>
      <div className="text-sm">
        <DateFormatter dateString={date} />
      </div>
    </section>
  );
};

export default HeroPost;
