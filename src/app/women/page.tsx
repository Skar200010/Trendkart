import ProductFilters from '@/components/ProductFilters';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

async function getWomenProducts() {
  try {
    await connectDB();
    const products = await Product.find({ category: 'women' }).sort({ createdAt: -1 }).lean();
    return products.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch women products:', error);
    return [];
  }
}

export default async function WomenPage() {
  const products = await getWomenProducts();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="relative py-16 bg-gradient-to-r from-pink-500 to-rose-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Women&apos;s Fashion</h1>
          <p className="mt-4 text-pink-100 text-lg">Discover elegant styles for women</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductFilters products={products} />
      </div>
    </div>
  );
}
