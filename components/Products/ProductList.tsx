import React, { useCallback, useEffect, useState } from 'react';
import { Edit3, Trash2, MoreHorizontal, Star, Eye, Package, TrendingUp } from 'lucide-react';
import { Product } from '../../type/index';


interface ProductListProps {
  products: Product[];
  onAdd: () => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onView?: (product: Product) => void;
}

type Review = {
  initials: string;
  name: string;
  rating: number;
  title: string;
  reviewText: string;
  date: string;
  helpful: number;
  notHelpful: number;
  userVote: boolean | null;
  productId: number;
};

const ProductList: React.FC<ProductListProps> = ({ products, onAdd, onEdit, onDelete, onView }) => {
  const [openMoreMenu, setOpenMoreMenu] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const handleMenuClick = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setOpenMoreMenu(openMoreMenu === productId ? null : productId);
  };

 

  const handleClickOutside = () => {
    setOpenMoreMenu(null);
  };

  
  //  useEffect(() => {
  //   const fetchReview = async () => {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/review`,{
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     const result: Review[] = await response.json();
  //     setReviews(result);
  //     console.log(result)
  //   };

  //   fetchReview();
  // }, []);


  
  // // Calculate average rating for a product from reviews
  // const getAvgRating = useCallback((productId: number) => {
  //   const productReviews = reviews.filter(r => r.productId === productId);
  //   if (productReviews.length === 0) return 0;
  //   const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
  //   return avg.toFixed(1);
  // }, [reviews]);

  React.useEffect(() => {
    if (openMoreMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMoreMenu]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-gray-600 text-lg">{products.length} {products.length === 1 ? 'item' : 'items'} in your catalog</p>
          </div>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Package className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex flex-wrap  gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product.productId}
            className="group relative bg-white rounded-2xl w-[400px] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2"
          >
            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                product.status === 'PUBLISHED'
                  ? 'bg-emerald-100/90 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-100/90 text-amber-700 border border-amber-200'
              }`}>
                {product.status === 'PUBLISHED' ? 'Live' : 'Draft'}
              </span>
            </div>

            {/* Low Stock Badge */}
            {product.stock < 5 && (
              <div className="absolute top-4 right-4 z-20">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100/90 text-red-700 border border-red-200 backdrop-blur-sm">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Low Stock
                </span>
              </div>
            )}

            {/* More Menu */}
            <div className="absolute top-4 right-4 z-30">
              {product.stock >= 5 && (
                <div className="relative">
                  <button
                    onClick={(e) => handleMenuClick(e, product.productId)}
                    className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-600" />
                  </button>
                  {openMoreMenu === product.productId && (
                    <div className="absolute top-12 right-0 bg-white shadow-xl rounded-xl w-48 border border-gray-100 py-2 z-50 backdrop-blur-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView && onView(product);
                          setOpenMoreMenu(null);
                        }}
                        className="w-full px-4 py-3 hover:bg-gray-50 text-left flex items-center gap-3 text-sm text-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(product);
                          setOpenMoreMenu(null);
                        }}
                        className="w-full px-4 py-3 hover:bg-gray-50 text-left flex items-center gap-3 text-sm text-gray-700"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Product
                      </button>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(product.productId);
                          setOpenMoreMenu(null);
                        }}
                        className="w-full px-4 py-3 hover:bg-red-50 text-left flex items-center gap-3 text-sm text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Product
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Product Content */}
            <div className="p-6 space-y-4">
              {/* Product Title and Rating */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                  {product.name}
                </h3>
                {/* <div className="flex items-center gap-2">
                     <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <Star fill="#fbbf24" stroke="#fbbf24" size={16} />
              <span style={{ marginLeft: 4, fontSize: '0.875rem', color: '#4b5563' }}>
                {getAvgRating(products.productId)}
              </span>
              <span style={{ marginLeft: 6, fontSize: '0.875rem', color: '#6b7280' }}>
                ({reviews.filter(r => r.productId === products.productId).length})
              </span>
            </div>
                </div> */}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {product.description}
              </p>

              {/* Price and Stock */}
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">
                   ₹{product.price.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Stock</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    product.stock < 5
                      ? 'bg-red-100 text-red-700'
                      : product.stock < 20
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {product.stock} units
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => onEdit(product)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product.productId)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="max-w-7xl mx-auto text-center py-16">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Get started by adding your first product to your catalog. You can manage inventory, pricing, and more.
          </p>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Package className="w-5 h-5" />
            Add Your First Product
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;