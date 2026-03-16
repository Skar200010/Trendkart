"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

interface SearchProduct {
  _id: string;
  title: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  discount: number;
  rating: number;
  image: string;
  affiliateLink: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("newest");

  const searchProducts = useCallback(async (searchQuery: string, sortBy: string) => {
    if (!searchQuery.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("search", searchQuery);
      params.set("sort", sortBy);
      
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchProducts(query, sort);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, sort, searchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? "Searching..." : `${products.length} results for "${query}"`}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const discountedPrice = product.price - (product.price * product.discount) / 100;
              return (
                <div key={product._id} className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="aspect-square relative bg-gray-100 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[3rem]">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-500">({product.rating})</span>
                    </div>
                    <div className="mt-3">
                      {product.discount > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900">₹{discountedPrice.toFixed(0)}</span>
                          <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                      )}
                    </div>
                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="nofollow sponsored"
                      className="mt-3 block w-full bg-primary text-white text-center py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found for "{query}"</p>
            <p className="text-gray-400 mt-2">Try different keywords</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Enter a search term to find products</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 animate-pulse h-12"></div>
            <div className="px-6 py-3 bg-primary rounded-lg animate-pulse h-12 w-24"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}
