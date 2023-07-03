import MoreStories from "../components/more-stories";
import Layout from "../components/layout/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";
import Post from "../interfaces/post";

type Props = {
  allPosts: Post[];
};

export default function Index({ allPosts }: Props) {
  const posts = allPosts.slice(0);
  return (
    <>
      <Layout>
        <Head>
          <title>Blog</title>
        </Head>
        <div>
          <h1 className="text-pink-700 text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
            Blog.
          </h1>
          {posts.length > 0 && <MoreStories posts={posts} />}
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts(["title", "date", "slug", "author", "excerpt"]);

  return {
    props: { allPosts },
  };
};
