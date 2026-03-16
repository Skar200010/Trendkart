import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/profile/', '/cart/', '/wishlist/'],
    },
    sitemap: 'https://trendkart.com/sitemap.xml',
  };
}
