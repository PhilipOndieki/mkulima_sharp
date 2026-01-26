import { useState } from 'react';
import AnimatedSection from '../components/common/AnimatedSection';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/common/Button';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'chicks', label: 'Day-Old Chicks' },
    { id: 'feeds', label: 'Poultry Feeds' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'supplements', label: 'Supplements' },
  ];

  // Sample products - replace with actual data from Firebase
  const allProducts = [
    {
      id: '1',
      name: 'Kari Improved Kienyeji Chicks',
      description: 'Hardy, fast-growing indigenous chickens',
      price: 150,
      category: 'chicks',
      imageUrl: '/products/kienyeji.jpg',
      stock: 500,
      unit: 'chick'
    },
    // Add more products here
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
  };

  return (
    <div className="min-h-screen py-8 md:py-12">
      {/* Page Header */}
      <div className="container-custom mb-8 md:mb-12">
        <AnimatedSection animation="fade-up">
          <h1 className="section-header">Our Products</h1>
          <p className="section-subheader">
            Quality products for every stage of your poultry farming journey
          </p>
        </AnimatedSection>
      </div>

      <div className="container-custom">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              {mobileFilterOpen ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          {/* Sidebar Filters */}
          <aside className={`
            lg:block mb-8 lg:mb-0
            ${mobileFilterOpen ? 'block' : 'hidden'}
          `}>
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setMobileFilterOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-all
                      ${selectedCategory === category.id
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <AnimatedSection key={product.id} animation="fade-up" delay={index * 50}>
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
