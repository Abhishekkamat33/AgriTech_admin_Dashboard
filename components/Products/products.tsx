'use client'
import React, {  useEffect, useState } from 'react';
import ProductModal from '../../components/Products/ProductModal';
import { Product } from '../../type/index';
import ProductList from './ProductList';

const Products: React.FC = () => {
  const [products, setProducts] = useState <Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
 const [isFetch, setIsFetch] = useState(false);

const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('authToken='))
  ?.split('=')[1];

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`,{
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      // console.log("Fetched products:", data);
      setProducts(data);
      setIsFetch(false)
    } catch{
      console.log('Error fetching products:');
    }
  };
  fetchProducts();
  }, [isFetch,token]);

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const deleteProduct = async () => {
          try{
               await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${productId}`,{
                method: 'DELETE',
               })
          }catch{
          console.log("Error deleting product")
          }
      }
      deleteProduct();
      setProducts(products.filter(product => product.productId !== productId));
    }
  };

  // const handleSaveProduct = (productData: Partial<Product>) => {
    
  //   if (editingProduct) {
     
  //     // Update existing product
  //     setProducts(products?.map(p => 
  //       p.productId === editingProduct.productId
  //         ? { ...p, ...productData }
  //         : p
  //     ));
  //   } else {
  //     // Add new product
  //     const newProduct: Product = {
  //       createdAt: new Date().toISOString().split('T')[0],
  //       ...productData as Omit<Product, 'id' | 'createdAt'>
  //     };
  //     setProducts([...products, newProduct]);
  //   }
  // };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <p className="text-gray-600">Manage your farming products inventory</p>
      </div>

      <ProductList
        products={products}
        onAdd={handleAddProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <ProductModal
        isOpen={isModalOpen}
         setIsFetch={setIsFetch}   // pass the setter with clear name
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
      />
    </div>
  );
};

export default Products;