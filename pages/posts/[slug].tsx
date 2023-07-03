import { useRouter } from "next/router";
import ErrorPage from "next/error";
import PostBody from "../../components/post/post-body";
import Layout from "../../components/layout/layout";
import { getPostBySlug, getAllPosts } from "../../lib/api";
import Head from "next/head";
import type PostType from "../../interfaces/post";
import dynamic from "next/dynamic";
import DateFormatter from "../../components/date-formatter";

type Props = {
  post: PostType;
  morePosts: PostType[];
  preview?: boolean;
};

const ThemeSwitchButton = dynamic(
  () => import("../../components/theme-switch-button/index"),
  {
    ssr: false,
  }
);

export default function Post({ post, morePosts, preview }: Props) {
  const router = useRouter();
  const title = `${post.title}`;
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout>
      <div>
        {router.isFallback ? (
          "Loading…"
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>{title}</title>
              </Head>
              <div className="max-w-2xl mx-auto">
                {title}
                <span onClick={router.back}>BACK</span>
                <ThemeSwitchButton />
                <div className="mb-2 text-lg font-black">
                  <DateFormatter dateString={post.date} />
                </div>
              </div>
              <PostBody content={post.content} />
            </article>
          </>
        )}
      </div>
    </Layout>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
  ]);

  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
