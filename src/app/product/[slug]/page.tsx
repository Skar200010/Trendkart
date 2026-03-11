import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Link from 'next/link';

async function getProduct(slug: string) {
  try {
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    if (!product) return null;
    return {
      ...product,
      _id: (product as any)._id.toString(),
      createdAt: (product as any).createdAt?.toISOString(),
      updatedAt: (product as any).updatedAt?.toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const discountedPrice = product.price - (product.price * product.discount / 100);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
        ← Back to Home
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold">₹{discountedPrice.toFixed(0)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-gray-500 line-through">₹{product.price}</span>
                <span className="text-green-600 font-semibold">{product.discount}% OFF</span>
              </>
            )}
          </div>
          <div className="flex items-center mb-6">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-gray-600">{product.rating}/5</span>
          </div>
          <a 
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
}
