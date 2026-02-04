import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import AnimatedSection from '../components/common/AnimatedSection';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/common/Button';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Categories extracted from products
  const [categories, setCategories] = useState([
    { id: 'all', label: 'All Products', count: 0 }
  ]);

  /**
   * Fetch products from Firestore
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Query products collection
        const productsRef = collection(db, 'products');
        const q = query(
          productsRef,
          where('isActive', '==', true),
          orderBy('category'),
          orderBy('name')
        );

        const querySnapshot = await getDocs(q);
        const productsData = [];

        querySnapshot.forEach((doc) => {
          productsData.push({
            id: doc.id,
            ...doc.data()
          });
        });

        console.log(` Loaded ${productsData.length} products from Firestore`);
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Extract unique categories with counts
        const categoryMap = new Map();
        productsData.forEach(product => {
          const count = categoryMap.get(product.category) || 0;
          categoryMap.set(product.category, count + 1);
        });

        const categoriesArray = [
          { id: 'all', label: 'All Products', count: productsData.length }
        ];

        categoryMap.forEach((count, category) => {
          categoriesArray.push({
            id: category.toLowerCase(),
            label: category,
            count
          });
        });

        setCategories(categoriesArray);

      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /**
   * Filter products by category
   */
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        product => product.category.toLowerCase() === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  /**
   * Handle category selection
   */
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setMobileFilterOpen(false);
  };

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className="min-h-screen py-8 md:py-12">
        <div className="container-custom">
          <h1 className="section-header text-center mb-8">Our Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                <div className="bg-white p-4 rounded-b-xl">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="min-h-screen py-8 md:py-12">
        <div className="container-custom">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-red-900 mb-2">
                Error Loading Products
              </h2>
              <p className="text-red-700 mb-4">{error}</p>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      {/* Page Header */}
      <div className="container-custom mb-8 md:mb-12">
        <AnimatedSection animation="fade-up">
          <h1 className="section-header text-center">Our Products</h1>
          <p className="section-subheader text-center">
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
              className="flex items-center justify-between"
            >
              <span>
                {categories.find(c => c.id === selectedCategory)?.label || 'Filter'}
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${mobileFilterOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </div>

          {/* Sidebar Filters */}
          <aside
            className={`
              lg:block mb-8 lg:mb-0
              ${mobileFilterOpen ? 'block' : 'hidden'}
            `}
          >
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-all
                      ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.label}</span>
                      <span className="text-sm text-gray-500">
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Filter Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing <strong>{filteredProducts.length}</strong> product{filteredProducts.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <AnimatedSection
                    key={product.id}
                    animation="fade-up"
                    delay={index * 50}
                  >
                    <ProductCard product={product} />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <svg
                    className="w-24 h-24 mx-auto text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    No products available in this category at the moment.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => handleCategorySelect('all')}
                  >
                    View All Products
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;