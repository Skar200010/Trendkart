'use client';

import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';

type ProductInput = Parameters<typeof ProductCard>[0]['product'];

const mockProduct: ProductInput = {
  _id: '507f1f77bcf86cd799439011',
  title: 'Test Product',
  slug: 'test-product',
  category: 'men',
  brand: 'TestBrand',
  price: 1000,
  discount: 10,
  rating: 4.5,
  image: '/test-image.jpg',
  affiliateLink: 'https://example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductCard', () => {
  it('renders product title', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product brand', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('TestBrand')).toBeInTheDocument();
  });

  it('displays discounted price when discount > 0', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('₹900')).toBeInTheDocument();
    expect(screen.getByText('₹1000')).toBeInTheDocument();
  });

  it('displays original price when no discount', () => {
    render(<ProductCard product={{ ...mockProduct, discount: 0 }} />);
    expect(screen.getByText('₹1000')).toBeInTheDocument();
  });

  it('displays discount badge when discount > 0', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('10% OFF')).toBeInTheDocument();
  });

  it('does not display discount badge when no discount', () => {
    render(<ProductCard product={{ ...mockProduct, discount: 0 }} />);
    expect(screen.queryByText('% OFF')).not.toBeInTheDocument();
  });

  it('displays rating', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('(4.5)')).toBeInTheDocument();
  });

  it('renders Buy Now button', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Buy Now')).toBeInTheDocument();
  });

  it('has correct affiliate link', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByText('Buy Now').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });
});

describe('ProductFilters - Search', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1200 });
  });

  const mockProducts: ProductInput[] = [
    { ...mockProduct, _id: '1', title: 'iPhone 15', brand: 'Apple' },
    { ...mockProduct, _id: '2', title: 'Samsung Galaxy', brand: 'Samsung' },
    { ...mockProduct, _id: '3', title: 'Sony Headphones', brand: 'Sony' },
  ];
  const mockBrands = ['Apple', 'Samsung', 'Sony'];

  it('renders search input', () => {
    render(<ProductFilters products={mockProducts} brands={mockBrands} />);
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('filters products by search query', () => {
    render(<ProductFilters products={mockProducts} brands={mockBrands} />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'iPhone' } });
    
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.queryByText('Samsung Galaxy')).not.toBeInTheDocument();
    expect(screen.queryByText('Sony Headphones')).not.toBeInTheDocument();
  });

  it('search is case insensitive', () => {
    render(<ProductFilters products={mockProducts} brands={mockBrands} />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'IPHONE' } });
    
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
  });

  it('shows all products when search is cleared', () => {
    render(<ProductFilters products={mockProducts} brands={mockBrands} />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'xyz' } });
    expect(screen.queryByText('iPhone 15')).not.toBeInTheDocument();
    
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();
    expect(screen.getByText('Sony Headphones')).toBeInTheDocument();
  });

  it('shows correct product count', () => {
    render(<ProductFilters products={mockProducts} brands={mockBrands} />);
    
    expect(screen.getByText(/Showing.*products/)).toBeInTheDocument();
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'iPhone' } });
    
    expect(screen.getByText(/Showing.*product/)).toBeInTheDocument();
  });

  it('has clear search button that appears when search has value', () => {
    render(<ProductFilters products={mockProducts} brands={mockBrands} />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    expect(screen.queryByTestId('clear-search')).not.toBeInTheDocument();
    
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    const clearButton = screen.getByTestId('clear-search');
    expect(clearButton).toBeInTheDocument();
  });

  it('clears search when clear button is clicked', () => {
    render(<ProductFilters products={mockProducts} brands={mockBrands} />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'iPhone' } });
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    
    const clearButton = screen.getByTestId('clear-search');
    fireEvent.click(clearButton);
    
    expect((searchInput as HTMLInputElement).value).toBe('');
  });
});

describe('ProductFilters - Search placement', () => {
  const mockProducts: ProductInput[] = [
    { ...mockProduct, _id: '1', title: 'Test Product A' },
  ];

  it('search input is rendered outside the product cards area', () => {
    render(<ProductFilters products={mockProducts} brands={['TestBrand']} />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    expect(searchInput).toBeInTheDocument();
    
    const productCardDiv = screen.getByText('Test Product A').closest('div[class*="group"]');
    expect(productCardDiv).toBeInTheDocument();
    
    const mainContent = searchInput.closest('div[class*="flex-1"]');
    expect(mainContent).toBeInTheDocument();
  });
});
