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
    <section className="mb-12">
      <div className="mb-8">
        <CoverImage title={title} src={coverImage} slug={slug} />
      </div>
      <h3 className="text-lg sm:text-4xl mb-4 lg:text-5xl leading-tight break-all">
        <Link
          as={`/posts/${slug}`}
          href="/posts/[slug]"
          className="hover:underline"
        >
          {title}
        </Link>
      </h3>
      <p className="text-sm sm:text-lg leading-relaxed mb-4 break-all font-light">
        {excerpt}
      </p>
      <div className="text-sm sm:text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>
    </section>
  );
};

export default HeroPost;
