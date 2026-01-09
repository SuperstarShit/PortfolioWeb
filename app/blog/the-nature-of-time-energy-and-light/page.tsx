// app/blog/the-nature-of-time/page.tsx
import React from "react";
import Link from "next/link";
import { BLOGS } from "../../../data/blogs";

const post = BLOGS.find(
  (p) => p.slug === "the-nature-of-time-energy-and-light"
);

export default function TheNatureOfTimePage() {
  if (!post) return <div>Post not found</div>;

  return (
    <article className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="text-sm text-white mb-4">
        {post.date} • {post.tags.join(" · ")}
      </div>
      <p className="mb-6 text-white">{post.excerpt}</p>

      <div className="border rounded overflow-hidden">
        <div style={{ height: 800 }}>
          <iframe
            src={post.pdf}
            title={post.title}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3 items-center">
        <a
          href={post.pdf}
          download
          className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
        >
          Download PDF
        </a>
        <Link href="/blog" className="text-sm text-teal-600 hover:underline">
          ← Back to blog
        </Link>
      </div>
    </article>
  );
}
