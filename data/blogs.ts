// data/blogs.ts

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  pdf?: string; // optional — for direct PDF link
}

export const BLOGS: BlogPost[] = [
  {
    id: "b1",
    slug: "toward-a-dimensional-theory-of-arithmetic",
    title: "Toward a Dimensional Theory of Arithmetic",
    date: "2025-04-26",
    excerpt:
      "A geometric intuition for arithmetic , reimagining operations as spatial processes.",
    tags: ["Math", "Research"],
    pdf: "/pdfs/dimensional-arithmetic-thesis.pdf",
  },
  {
    id: "b2",
    slug: "the-nature-of-time-energy-and-light",
    title: "The Nature of Time, Energy, and Light",
    date: "2025-08-13",
    excerpt:
      "Exploring how time emerges from energy exchange , light as the messenger of change.",
    tags: ["Physics", "Philosophy"],
    pdf: "/pdfs/the-nature-of-time.pdf",
  },
];
