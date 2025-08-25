import React, { useState, useEffect } from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';
import { Product } from '@/type';
// import getTokenFromCookie from '@/app/fetch_token';


// Type definitions based on your entities


interface Category {
    categoryId?: string;
    categoryName: string;
    description: string;
    status: "ACTIVE" | "INACTIVE";
}

interface Manufacturer {
    manufacturerId?: string;
    name: string;
    contactInfo: string;
    description: string;
    status: "ACTIVE" | "INACTIVE";
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
    setIsFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, setIsFetch }) => {
    const [activeTab, setActiveTab] = useState<'product' | 'category' | 'manufacturer'>('product');
    const [file, setFile] = useState<File | null>(null);
    const [isSubmit, setIsSubmit] = useState(false);

    // Product form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        image: '',
        status: 'PUBLISHED' as "PUBLISHED" | "UNPUBLISHED",
        manufacturer: '',
    });

    // Category form state
    const [categoryForm, setCategoryForm] = useState({
        categoryName: '',
        description: '',
        status: 'ACTIVE' as "ACTIVE" | "INACTIVE"
    });

    // Manufacturer form state
    const [manufacturerForm, setManufacturerForm] = useState({
        name: '',
        contactInfo: '',
        description: '',
        status: 'ACTIVE' as "ACTIVE" | "INACTIVE"
    });

    // Mock data - replace with API calls
    const [categories, setCategories] = useState<Category[]>([]);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];


    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category.categoryId,
                stock: product.stock,
                image: product.image,
                status: product.status,
                manufacturer: product.manufacturer.manufacturerId,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                category: '',
                stock: 0,
                image: '',
                status: 'PUBLISHED',
                manufacturer: '',
            });
        }
    }, [product]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`


                    }
                });
                const data = await response.json();
                console.log("Fetched categories:", data);
                setCategories(data);
            } catch{
                console.log('Error fetching categories:');
            }
        };

        const fetchManufacturers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manufacturers`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }

                });
                const data = await response.json();
                console.log("Fetched manufacturers:", data);
                setManufacturers(data);
            } catch{
                console.log('Error fetching manufacturers:');
            }
        };

        if (isOpen) {
            fetchCategories();
            fetchManufacturers();
        }
    }, [isOpen, token]);


    const handleProductSubmit = async () => {

        setIsSubmit(true)

        const selectedCategory = categories.find(cat => cat.categoryName === formData.category);
        const selectedManufacturer = manufacturers.find(mfg => mfg.name === formData.manufacturer);

        const newFormData = {
            ...formData,
            category: {
                categoryId: selectedCategory ? selectedCategory.categoryId : product?.category?.categoryId || null,
            },
            manufacturer: {
                manufacturerId: selectedManufacturer ? selectedManufacturer.manufacturerId : product?.manufacturer?.manufacturerId || null,
            },
        };


        if (file) {
            const uploadData = new FormData();
            uploadData.append("file", file);


            const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/uploadProductImage`, {
                method: 'POST',
                body: uploadData,
            });


            if (!uploadResponse.ok) {
                alert("Image upload failed");
                return;
            }

            const imageUrl = await uploadResponse.text(); // Your backend returns plain URL string
            newFormData.image = imageUrl;  // Set uploaded image URL to your product data
        }


        try {
            let response;
            if (product && product.productId) {
                response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${product.productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(newFormData),
                });

                if (response.ok) {
                    setIsFetch(true);
                }

            } else {


                if (!newFormData.category || !newFormData.description || !newFormData.image || !newFormData.manufacturer || !newFormData.name || !newFormData.price || !newFormData.status || !newFormData.stock) {
                    alert("Enter every field")
                    return;
                }
                response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newFormData),
                });
            }

            if (response.ok) {
                setFormData({
                    name: '',
                    description: '',
                    price: 0,
                    category: '',
                    stock: 0,
                    image: '',
                    status: 'PUBLISHED',
                    manufacturer: '',
                });

                setIsFetch(true);
                setIsSubmit(false);

                setFile(null);  // file state भी reset करें
                onClose();
            } else {
                const errorData = await response.json();
                console.log('Error response:', errorData);
                // जरूरत अनुसार यूज़र को error संदेश दिखाएं
            }
        } catch {
            console.log('Error submitting product:');
            // console.error('Error submitting product:', error);
        }
    };



    const handleCategorySubmit = async () => {
        try {
            const url = editingCategory
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${editingCategory.categoryId}`
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`;

            const method = editingCategory ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(categoryForm),
            });

            if (response.ok) {
                const savedCategory = await response.json();

                if (editingCategory) {
                    setCategories(categories.map(cat =>
                        cat.categoryId === editingCategory.categoryId ? savedCategory : cat
                    ));
                } else {
                    setCategories([...categories, savedCategory]);
                }

                setCategoryForm({ categoryName: '', description: '', status: 'ACTIVE' });
                setEditingCategory(null);
            }
        } catch {
            console.log('Error saving category:');
         
        }
    };

    const handleManufacturerSubmit = async () => {
        try {
            const url = editingManufacturer
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manufacturers/${editingManufacturer.manufacturerId}`
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manufacturers`;

            const method = editingManufacturer ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(manufacturerForm),
            });

            if (response.ok) {
                const savedManufacturer = await response.json();

                if (editingManufacturer) {
                    setManufacturers(manufacturers.map(mfg =>
                        mfg.manufacturerId === editingManufacturer.manufacturerId ? savedManufacturer : mfg
                    ));
                } else {
                    setManufacturers([...manufacturers, savedManufacturer]);
                }

                setManufacturerForm({ name: '', contactInfo: '', description: '', status: 'ACTIVE' });
                setEditingManufacturer(null);
            }
        } catch{
            console.log('Error saving manufacturer:');
        }
    };

    const handleEditCategory = (category: Category) => {
        setCategoryForm({
            categoryName: category.categoryName,
            description: category.description,
            status: category.status
        });
        setEditingCategory(category);
    };

    const handleEditManufacturer = (manufacturer: Manufacturer) => {
        setManufacturerForm({
            name: manufacturer.name,
            contactInfo: manufacturer.contactInfo,
            description: manufacturer.description,
            status: manufacturer.status
        });
        setEditingManufacturer(manufacturer);
    };

    const handleDeleteCategory = async (categoryId: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${categoryId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setCategories(categories.filter(cat => cat.categoryId !== categoryId));
                }
            } catch {
                console.log('Error deleting category:');
            }
        }
    };

    const handleDeleteManufacturer = async (manufacturerId: string) => {
        if (window.confirm('Are you sure you want to delete this manufacturer?')) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manufacturers/${manufacturerId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setManufacturers(manufacturers.filter(mfg => mfg.manufacturerId !== manufacturerId));
                }
            } catch {
                console.log('Error deleting manufacturer:');
            }
        }
    };





    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Product Management
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('product')}
                        className={`px-6 py-3 text-sm font-medium ${activeTab === 'product'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {product ? 'Edit Product' : 'Add Product'}
                    </button>
                    <button
                        onClick={() => setActiveTab('category')}
                        className={`px-6 py-3 text-sm font-medium ${activeTab === 'category'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Manage Categories
                    </button>
                    <button
                        onClick={() => setActiveTab('manufacturer')}
                        className={`px-6 py-3 text-sm font-medium ${activeTab === 'manufacturer'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Manage Manufacturers
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'product' && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                {/* Manufacturer */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                                    <select
                                        value={formData.manufacturer}
                                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    >
                                        <option value="">Select Manufacturer</option>
                                        {manufacturers.filter(m => m.status === 'ACTIVE').map(manufacturer => (
                                            <option key={manufacturer.manufacturerId} value={manufacturer.name}>
                                                {manufacturer.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.filter(c => c.status === 'ACTIVE').map(category => (
                                            <option key={category.categoryId} value={category.categoryName}>
                                                {category.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        min={0}  // restrict HTML input minimum to 0
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            if (value < 0) {
                                                // Optionally, ignore or reset to 0 if user enters negative number
                                                setFormData({ ...formData, price: 0 });
                                            } else {
                                                setFormData({ ...formData, price: value });
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />

                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        min={0}  // restrict minimum value to 0
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            setFormData({ ...formData, stock: value < 0 ? 0 : value }); // prevent negative values in state
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />

                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'PUBLISHED' | 'UNPUBLISHED' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="PUBLISHED">PUBLISHED</option>
                                        <option value="UNPUBLISHED">UNPUBLISHED</option>
                                    </select>
                                </div>

                                {/* Image URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setFile(e.target.files[0]);  // पहला file select करें
                                            } else {
                                                setFile(null); // फाइल न हो तो null करें
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="upload image file"
                                    />


                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Product Actions */}
                            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleProductSubmit}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                                >
                                    {product ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'category' && (
                        <div className="p-6">
                            {/* Category Form */}
                            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                                        <input
                                            type="text"
                                            value={categoryForm.categoryName}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, categoryName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={categoryForm.status}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="INACTIVE">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={categoryForm.description}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-4">
                                    {editingCategory && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingCategory(null);
                                                setCategoryForm({ categoryName: '', description: '', status: 'ACTIVE' });
                                            }}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                    <button
                                        disabled={isSubmit}
                                        onClick={handleCategorySubmit}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    >
                                        {editingCategory ? 'Update Category' : 'Add Category'}
                                    </button>

                                </div>
                            </div>

                            {/* Categories List */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Categories</h3>
                                <div className="space-y-3">
                                    {categories.map(category => (
                                        <div key={category.categoryId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{category.categoryName}</h4>
                                                <p className="text-sm text-gray-600">{category.description}</p>
                                                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${category.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {category.status}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditCategory(category)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(category.categoryId!)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'manufacturer' && (
                        <div className="p-6">
                            {/* Manufacturer Form */}
                            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    {editingManufacturer ? 'Edit Manufacturer' : 'Add New Manufacturer'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer Name</label>
                                        <input
                                            type="text"
                                            value={manufacturerForm.name}
                                            onChange={(e) => setManufacturerForm({ ...manufacturerForm, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Info</label>
                                        <input
                                            type="text"
                                            value={manufacturerForm.contactInfo}
                                            onChange={(e) => setManufacturerForm({ ...manufacturerForm, contactInfo: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Email or phone"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={manufacturerForm.status}
                                            onChange={(e) => setManufacturerForm({ ...manufacturerForm, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="INACTIVE">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={manufacturerForm.description}
                                            onChange={(e) => setManufacturerForm({ ...manufacturerForm, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-4">
                                    {editingManufacturer && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingManufacturer(null);
                                                setManufacturerForm({ name: '', contactInfo: '', description: '', status: 'ACTIVE' });
                                            }}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={handleManufacturerSubmit}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    >
                                        {editingManufacturer ? 'Update Manufacturer' : 'Add Manufacturer'}
                                    </button>
                                </div>
                            </div>

                            {/* Manufacturers List */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Manufacturers</h3>
                                <div className="space-y-3">
                                    {manufacturers.map(manufacturer => (
                                        <div key={manufacturer.manufacturerId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{manufacturer.name}</h4>
                                                <p className="text-sm text-gray-600">{manufacturer.description}</p>
                                                <p className="text-sm text-blue-600">{manufacturer.contactInfo}</p>
                                                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${manufacturer.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {manufacturer.status}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditManufacturer(manufacturer)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteManufacturer(manufacturer.manufacturerId!)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductModal;