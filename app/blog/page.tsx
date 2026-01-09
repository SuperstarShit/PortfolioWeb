// // app/blog/page.tsx
// import React from "react";
// import Link from "next/link";
// import { BLOGS, BlogPost } from "../../data/blogs";

// export default function BlogIndexPage() {
//   return (
//     <main className="max-w-4xl mx-auto p-6">
//       <h1 className="text-4xl font-extrabold mb-4">Blog</h1>
//       <p className="white">
//         Essays and reflections connecting mathematics, physics, and computing.
//       </p>

//       <div className="grid gap-6">
//         {BLOGS.map((b: BlogPost) => (
//           <article
//             key={b.id}
//             className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex-1">
//                 <div className="text-xs text-gray-400">{b.date}</div>
//                 <h2 className="text-2xl text-black font-semibold mt-1">{b.title}</h2>
//                 <p className="text-sm text-gray-600 mt-3">{b.excerpt}</p>

//                 <div className="mt-4 flex items-center gap-3">
//                   {b.pdf ? (
//                     <a
//                       href={b.pdf}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="mt-3 inline-block text-sm text-teal-600 hover:text-teal-700 font-medium"
//                     >
//                       Read →
//                     </a>
//                   ) : (
//                     <Link
//                       href={`/blog/${b.slug}`}
//                       className="mt-3 inline-block text-sm text-teal-600 hover:text-teal-700 font-medium"
//                     >
//                       Read →
//                     </Link>
//                   )}

//                   <div className="text-xs text-gray-500">•</div>
//                   <div className="flex gap-2">
//                     {b.tags.map((t) => (
//                       <span
//                         key={t}
//                         className="text-xs px-2 py-1 bg-slate-100 rounded text-gray-600"
//                       >
//                         {t}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* small decorative area (optional) */}
//               <div className="hidden sm:flex flex-col items-end text-right">
//                 <div className="text-xs text-black mb-2">Article</div>
//                 <div className="text-sm text-gray-500">{b.tags.join(" · ")}</div>
//               </div>
//             </div>
//           </article>
//         ))}
//       </div>

//       <div className="mt-10 text-sm text-white text-center">
//         <Link href="/" className="underline">
//           ← Back to portfolio
//         </Link>
//       </div>
//     </main>
//   );
// }
"use client";

import React, { useState } from 'react';
import { ChevronLeft, Calendar, Tag } from 'lucide-react';

// Blog data structure
const BLOGS = [
  {
    id: 'b1',
    slug: 'toward-a-dimensional-theory-of-arithmetic',
    title: 'Toward a Dimensional Theory of Arithmetic',
    date: '2025-05-26',
    excerpt: 'A short essay introducing the geometric intuition behind arithmetic.',
    tags: ['Mathematics', 'Geometry', 'Arithmetic'],
    content: `# Toward a Dimensional Theory of Arithmetic

## Introduction

Numbers are typically thought of as abstract entities living on a line. But what if we could visualize them geometrically, as shapes with dimension?

### The Core Idea

In classical arithmetic, we add, multiply, and manipulate numbers as scalar quantities. The dimensional theory proposes that each number can be associated with a geometric form:

- **1D**: A line segment of length n
- **2D**: A square or rectangle of side n
- **3D**: A cube of side n

### Addition & Combination

When we add two numbers in this framework, we're not just combining scalars—we're combining geometric forms. The result is a new dimensional shape that encodes the relationship.

For example: 2 ⊕ 3 might represent a 2×3 rectangle, which has area 6 (the product) and perimeter 10 (related to the sum).

### Implications

This dimensional view opens new questions:
- How do prime numbers appear geometrically?
- What does division look like in dimensional space?
- Can complex numbers be understood as higher-dimensional forms?

### Conclusion

By bridging arithmetic and geometry, we gain intuition into the structure of numbers themselves. This is just the beginning of a larger theory connecting topology, algebra, and visualization.

---

*This essay is part of ongoing research into the foundational structures of mathematics.*`,
  },
  {
    id: 'b2',
    slug: 'the-nature-of-time-energy-and-light',
    title: 'The Nature of Time, Energy, and Light',
    date: '2025-11-06',
    excerpt: 'Exploring how time emerges from energy exchange, light as the messenger of change, and entropy as the arrow of time.',
    tags: ['Physics', 'Thermodynamics', 'Relativity'],
    content: `# The Nature of Time, Energy, and Light

## Prelude

What is time? Physics gives us equations, but not understanding. This essay explores time not as a fourth dimension, but as an emergent property of energy exchange.

## Time as Energy Exchange

In our universe, nothing happens without energy transfer. A photon carries energy across space. A particle oscillates, trading kinetic for potential energy. Life itself is a continuous dance of energy transformations.

### The Arrow of Time

Entropy tells us the direction. In a closed system, disorder always increases. This asymmetry—from ordered past to disordered future—is what we experience as the flow of time.

### Light as Messenger

Light travels at the speed of causality. Every event in the universe is communicated through electromagnetic waves. Time is the measure of how information propagates.

## Conclusion

Time emerges from the interplay of energy, entropy, and causality. It is not a fundamental dimension but a manifestation of how the universe evolves and exchanges information.`,
  },
];

// Markdown-like renderer
function renderMarkdown(text) {
  let html = text
    .split('\n')
    .map((line, idx) => {
      // Headers
      if (line.startsWith('# ')) {
        return `<h1 key="${idx}" class="text-3xl font-bold mt-6 mb-3">${line.slice(2)}</h1>`;
      }
      if (line.startsWith('## ')) {
        return `<h2 key="${idx}" class="text-2xl font-bold mt-5 mb-2">${line.slice(3)}</h2>`;
      }
      if (line.startsWith('### ')) {
        return `<h3 key="${idx}" class="text-xl font-semibold mt-4 mb-2">${line.slice(4)}</h3>`;
      }
      // Bold and italic
      let formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 rounded">$1</code>');

      // Lists
      if (line.startsWith('- ')) {
        return `<li key="${idx}" class="ml-4 mb-1">${formatted.slice(2)}</li>`;
      }
      
      // Horizontal rule
      if (line.trim() === '---') {
        return `<hr key="${idx}" class="my-6 border-gray-300" />`;
      }

      // Paragraphs
      if (formatted.trim()) {
        return `<p key="${idx}" class="mb-3 leading-relaxed text-gray-700">${formatted}</p>`;
      }
      return `<div key="${idx}" class="mb-2" />`;
    })
    .join('');

  return html;
}

// Blog Index Page
function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Blog</h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600">
            Essays and reflections connecting mathematics, physics, and computing.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-4 sm:space-y-6">
          {BLOGS.map((b) => (
            <article
              key={b.id}
              className="bg-white rounded-lg sm:rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2">
                      <Calendar size={14} />
                      <time>{b.date}</time>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">
                      {b.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
                      {b.excerpt}
                    </p>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <a
                        href={`#blog/${b.slug}`}
                        className="inline-block text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        Read Article →
                      </a>
                      <div className="hidden sm:block text-xs text-gray-400">•</div>
                      <div className="flex flex-wrap gap-2">
                        {b.tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-slate-100 rounded text-gray-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            <Tag size={12} />
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decorative area - hidden on mobile */}
                  <div className="hidden md:flex flex-col items-end text-right min-w-max">
                    <div className="text-xs font-medium text-gray-900 mb-2">Article</div>
                    <div className="text-xs sm:text-sm text-gray-500">{b.tags[0]}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Back button */}
        <div className="mt-8 sm:mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors hover:underline"
          >
            <ChevronLeft size={16} />
            Back to portfolio
          </a>
        </div>
      </div>
    </main>
  );
}

// Blog Detail Page
function BlogDetailPage({ slug }) {
  const blog = BLOGS.find((b) => b.slug === slug);
  const [showDetails, setShowDetails] = useState(true);

  if (!blog) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Article not found</h1>
          <a href="/" className="mt-4 inline-block text-teal-600 hover:text-teal-700">
            ← Back to blog
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 mb-4">
            <ChevronLeft size={16} />
            Back
          </a>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 leading-tight mt-2">
            {blog.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <time>{blog.date}</time>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((t) => (
                <span key={t} className="inline-block px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <article className="bg-white rounded-lg sm:rounded-xl shadow-md p-6 sm:p-8 prose prose-sm sm:prose max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(blog.content || ''),
            }}
            className="text-gray-800"
          />
        </article>

        {/* Related Articles */}
        <div className="mt-12 sm:mt-16">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">More Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BLOGS.filter((b) => b.id !== blog.id)
              .slice(0, 2)
              .map((b) => (
                <a
                  key={b.id}
                  href={`#blog/${b.slug}`}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-900">{b.title}</h4>
                  <p className="text-sm text-gray-600 mt-2">{b.excerpt}</p>
                  <div className="mt-3 text-xs text-teal-600">Read →</div>
                </a>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// Main App Component
export default function BlogApp() {
  const [currentPage, setCurrentPage] = useState('index');
  const [selectedSlug, setSelectedSlug] = useState('');

  const handleNavigate = (slug) => {
    setSelectedSlug(slug);
    setCurrentPage('detail');
    window.scrollTo(0, 0);
  };

  const handleBackToIndex = () => {
    setCurrentPage('index');
    window.scrollTo(0, 0);
  };

  // Override link clicks to use client-side routing
  React.useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a[href^="#blog/"]');
      if (link) {
        e.preventDefault();
        const slug = link.href.split('#blog/')[1];
        handleNavigate(slug);
      }
      const backLink = e.target.closest('a[href="/"]');
      if (backLink && currentPage === 'detail') {
        e.preventDefault();
        handleBackToIndex();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [currentPage]);

  return currentPage === 'index' ? (
    <BlogIndexPage />
  ) : (
    <BlogDetailPage slug={selectedSlug} />
  );
}
