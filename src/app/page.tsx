import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import BlogGrid from '@/components/BlogGrid';
import HeroSection from '@/components/HeroSection';
import CategoryBanners from '@/components/CategoryBanners';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Post from '@/models/Post';

async function getProducts() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return products.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

async function getPosts() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 }).limit(3).lean();
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

export default async function Home() {
  const allProducts = await getProducts();
  const posts = await getPosts();

  const trendingProducts = allProducts.slice(0, 4);
  const bestUnder999 = allProducts.filter((p: any) => {
    const discountedPrice = p.price - (p.price * (p.discount || 0) / 100);
    return discountedPrice < 999;
  }).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <ProductGrid 
        products={trendingProducts} 
        title="Trending Now" 
        viewAllLink="/men"
      />

      <section className="gradient-bg py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+PC9zdmc+')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Best Under ₹999
              </h2>
              <p className="text-white/80 mt-2 text-lg">Amazing deals on budget-friendly fashion</p>
            </div>
            <Link href="/men" className="inline-flex items-center text-white hover:text-white/80 font-medium transition-colors bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-xl">
              View All
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <ProductGrid products={bestUnder999} />

      <CategoryBanners />

      <BlogGrid 
        posts={posts} 
        title="Latest from Blog" 
        viewAllLink="/blog"
      />

      <section className="bg-card py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="blob blob-1 opacity-20" />
          <div className="blob blob-2 opacity-20" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-text-secondary mb-10 max-w-xl mx-auto text-lg">
            Get the latest fashion trends, exclusive deals, and style tips delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-5 py-4 rounded-xl bg-background border border-text-secondary/20 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <button 
              type="submit"
              className="btn-primary whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
