import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import AnimatedSection from '../../components/common/AnimatedSection';
import StockEditModal from '../../components/admin/StockEditModal';
import { HiExclamation, HiFilter } from 'react-icons/hi';
import clsx from 'clsx';

/**
 * AdminInventory Component
 * 
 * Product inventory management page
 */
const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all, low, out

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);

      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStock = (product, variant) => {
    setSelectedVariant({ product, variant });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedVariant(null);
  };

  const handleStockUpdate = () => {
    // Refresh products after update
    fetchProducts();
  };

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesCategory;
  });

  // Get all variants with stock status
  const getAllVariants = () => {
    const variants = [];
    
    filteredProducts.forEach(product => {
      if (product.variants) {
        product.variants.forEach(variant => {
          const stockQty = variant.stockQuantity || 0;
          const threshold = variant.lowStockThreshold || 10;
          const isLowStock = stockQty < threshold;
          const isOutOfStock = stockQty === 0;

          // Apply stock filter
          if (stockFilter === 'low' && !isLowStock) return;
          if (stockFilter === 'out' && !isOutOfStock) return;

          variants.push({
            product,
            variant,
            isLowStock,
            isOutOfStock
          });
        });
      }
    });

    return variants;
  };

  const allVariants = getAllVariants();
  const lowStockCount = allVariants.filter(v => v.isLowStock).length;
  const outOfStockCount = allVariants.filter(v => v.isOutOfStock).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <AnimatedSection animation="fade-up">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Inventory Management
          </h1>
          <p className="text-gray-600">
            Monitor and update product stock levels
          </p>
        </div>
      </AnimatedSection>

      {/* Stock Summary Cards */}
      <AnimatedSection animation="fade-up" delay={100}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{allVariants.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-amber-600">{lowStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <HiExclamation className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
                <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Filters */}
      <AnimatedSection animation="fade-up" delay={200}>
        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <HiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stock Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Status
              </label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Items</option>
                <option value="low">Low Stock Only</option>
                <option value="out">Out of Stock Only</option>
              </select>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Products Grid */}
      <AnimatedSection animation="fade-up" delay={300}>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6">
                <div className="h-32 bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : allVariants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allVariants.map((item) => (
              <div
                key={`${item.product.id}-${item.variant.id}`}
                className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=600&fit=crop';
                    }}
                  />
                  
                  {/* Stock Status Badge */}
                  {item.isOutOfStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      OUT OF STOCK
                    </div>
                  )}
                  {item.isLowStock && !item.isOutOfStock && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      LOW STOCK
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {item.variant.name}
                  </p>

                  {/* Stock Quantity */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Current Stock</p>
                      <p className={clsx(
                        'text-2xl font-bold',
                        item.isOutOfStock ? 'text-red-600' :
                        item.isLowStock ? 'text-amber-600' :
                        'text-green-600'
                      )}>
                        {item.variant.stockQuantity || 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-1">SKU</p>
                      <p className="text-sm font-mono text-gray-900">
                        {item.variant.sku}
                      </p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Retail</p>
                      <p className="font-semibold text-gray-900">
                        KES {item.variant.retailPrice?.toLocaleString()}
                      </p>
                    </div>
                    {item.variant.wholesalePrice && (
                      <div className="text-right">
                        <p className="text-gray-600">Wholesale</p>
                        <p className="font-semibold text-gray-900">
                          KES {item.variant.wholesalePrice?.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditStock(item.product, item.variant)}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Update Stock
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-card p-12 text-center">
            <p className="text-gray-600">No products found matching your filters</p>
          </div>
        )}
      </AnimatedSection>

      {/* Stock Edit Modal */}
      {selectedVariant && (
        <StockEditModal
          product={selectedVariant.product}
          variant={selectedVariant.variant}
          isOpen={modalOpen}
          onClose={handleModalClose}
          onUpdate={handleStockUpdate}
        />
      )}
    </div>
  );
};

export default AdminInventory;