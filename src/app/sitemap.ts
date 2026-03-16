import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://trendkart.com';
  
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/men`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/women`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/login`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: new Date(), priority: 0.5 },
  ];

  try {
    await connectDB();
    const products = await Product.find({}).select('slug updatedAt').limit(1000);
    
    const productPages = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt || new Date(),
      priority: 0.7,
    }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
