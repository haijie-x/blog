import { allPosts } from "@/.contentlayer/generated"
import DateFormatter from "@/components/date-formatter"
import Link from "next/link"

export default function Home() {
  return (
    <div className="prose dark:prose-invert mt-10">
      {allPosts.map((post) => (
        <article key={post._id}>
          <Link href={post.slug}>
            <h4>{post.title}</h4>
          </Link>
          {post.description && (
            <div className="text-sm">{post.description}</div>
          )}
          {post.date && (
            <span className="text-xs">
              <DateFormatter dateString={post.date} />
            </span>
          )}
        </article>
      ))}
    </div>
  )
}
