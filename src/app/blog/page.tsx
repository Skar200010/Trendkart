import BlogGrid from '@/components/BlogGrid';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';

async function getPosts() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    return posts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="relative py-16 bg-gradient-to-r from-indigo-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Fashion Blog</h1>
          <p className="mt-4 text-pink-100 text-lg">Latest trends, tips and style guides</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BlogGrid posts={posts} />
      </div>
    </div>
  );
}
