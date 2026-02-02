import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import ProductCard from '../../components/admin/ProductCard';
import ProductFormModal from '../../components/admin/ProductFormModal';
import Button from '../../components/common/Button';
import { HiPlus, HiSearch } from 'react-icons/hi';

/**
 * AdminProducts Page
 * 
 * Manage all products - Create, Read, Update, Delete (CRUD)
 * Works with existing products collection
 */
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showInactive, setShowInactive] = useState(false);

  // Categories
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Feeders', label: 'Feeders' },
    { id: 'Drinkers', label: 'Drinkers' },
    { id: 'Brooding Equipment', label: 'Brooding Equipment' },
    { id: 'Automatic Incubators', label: 'Automatic Incubators' },
    { id: 'Cages & Mesh', label: 'Cages & Mesh' }
  ];

  /**
   * Fetch products from Firestore
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const productsData = [];
      querySnapshot.forEach((doc) => {
        productsData.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log(`✅ Loaded ${productsData.length} products`);
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError('Failed to load products. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Filter products based on search, category, and active status
   */
  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filter by active status
    if (!showInactive) {
      filtered = filtered.filter((product) => product.isActive !== false);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, showInactive, products]);

  /**
   * Handle add product
   */
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  /**
   * Handle edit product
   */
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  /**
   * Handle submit (add or edit)
   */
  const handleSubmitProduct = async (productData) => {
    try {
      setSaving(true);
      setError(null);

      if (editingProduct) {
        // UPDATE existing product
        const productRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productRef, {
          ...productData,
          updatedAt: serverTimestamp()
        });

        console.log('✅ Product updated:', editingProduct.id);
        setSuccess('Product updated successfully!');
      } else {
        // ADD new product
        const newProduct = {
          ...productData,
          id: `prod_${Date.now()}`,
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await addDoc(collection(db, 'products'), newProduct);

        console.log('✅ Product added');
        setSuccess('Product added successfully!');
      }

      // Refresh products list
      await fetchProducts();

      // Close modal
      setIsModalOpen(false);
      setEditingProduct(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('❌ Error saving product:', err);
      setError('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle toggle active status
   */
  const handleToggleActive = async (product) => {
    const newStatus = !product.isActive;
    const action = newStatus ? 'activate' : 'deactivate';

    if (window.confirm(`Are you sure you want to ${action} "${product.name}"?`)) {
      try {
        const productRef = doc(db, 'products', product.id);
        await updateDoc(productRef, {
          isActive: newStatus,
          updatedAt: serverTimestamp()
        });

        console.log(`✅ Product ${action}d:`, product.id);
        setSuccess(`Product ${action}d successfully!`);

        // Refresh products
        await fetchProducts();

        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error(`❌ Error ${action}ing product:`, err);
        setError(`Failed to ${action} product. Please try again.`);
      }
    }
  };

  /**
   * Handle delete product (soft delete)
   */
  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This will mark it as inactive.`)) {
      try {
        const productRef = doc(db, 'products', product.id);
        await updateDoc(productRef, {
          isActive: false,
          deletedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        console.log('✅ Product deleted (soft):', product.id);
        setSuccess('Product deleted successfully!');

        // Refresh products
        await fetchProducts();

        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('❌ Error deleting product:', err);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
            <Button
              variant="primary"
              size="md"
              onClick={handleAddProduct}
              className="flex items-center gap-2"
            >
              <HiPlus className="w-5 h-5" />
              Add Product
            </Button>
          </div>
          <p className="text-gray-600">
            {products.length} total product{products.length !== 1 ? 's' : ''} • {filteredProducts.length} shown
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Search by name, description..."
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Show Inactive Toggle */}
            <div className="flex items-end">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Show inactive products
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-card">
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
                {searchTerm || selectedCategory !== 'all'
                  ? 'No products match your filters. Try adjusting your search.'
                  : 'Start by adding your first product.'}
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <Button variant="primary" onClick={handleAddProduct}>
                  Add Your First Product
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmitProduct}
        product={editingProduct}
        loading={saving}
      />
    </div>
  );
};

export default AdminProducts;