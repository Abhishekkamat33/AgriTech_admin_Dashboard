'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Download, Upload, AlertTriangle, Package, 
  TrendingUp, DollarSign, Clock, Grid3X3, List, BarChart3, 
  Truck, MapPin, Calendar, Tag, Eye, Edit2, Trash2, MoreVertical,
  ScanLine, Bell, Settings, RefreshCw, Archive, X, Check,
  ChevronDown, ChevronRight, Star, AlertCircle
} from 'lucide-react';

import { InventoryFilters, InventoryItem,InventoryStats} from '../type/index';




interface StockMovement {
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference?: string;
  notes?: string;
  date?: string;
  user?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Add Item Modal Component
const AddItemModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Partial<InventoryItem>) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    description: '',
    category: 'seeds',
    subcategory: '',
    sku: '',
    barcode: '',
    quantity: 0,
    minStock: 0,
    maxStock: 0,
    reorderPoint: 0,
    unit: 'pieces',
    costPrice: 0,
    sellingPrice: 0,
    supplier: '',
    location: '',
    condition: 'new',
    tags: [],
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const categoryOptions = [
    { value: 'seeds', label: 'Seeds & Saplings', icon: '🌱' },
    { value: 'fertilizers', label: 'Fertilizers', icon: '🧪' },
    { value: 'pesticides', label: 'Pesticides & Herbicides', icon: '🚿' },
    { value: 'organic', label: 'Organic Products', icon: '🌿' },
    { value: 'equipment', label: 'Heavy Equipment', icon: '🚜' },
    { value: 'tools', label: 'Tools & Implements', icon: '🔧' },
    { value: 'irrigation', label: 'Irrigation Systems', icon: '💧' },
    { value: 'chemicals', label: 'Agricultural Chemicals', icon: '⚗️' }
  ];

  const unitOptions = ['pieces', 'kg', 'g', 'lbs', 'tons', 'liters', 'ml', 'gallons', 'boxes', 'bags', 'packets'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: formData.quantity! > 0 ? 'in-stock' : 'out-of-stock',
      reservedQuantity: 0
    });
    setCurrentStep(1);
    setFormData({
      name: '',
      description: '',
      category: 'seeds',
      subcategory: '',
      sku: '',
      barcode: '',
      quantity: 0,
      minStock: 0,
      maxStock: 0,
      reorderPoint: 0,
      unit: 'pieces',
      costPrice: 0,
      sellingPrice: 0,
      supplier: '',
      location: '',
      condition: 'new',
      tags: [],
      notes: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Add New Inventory Item</h2>
              <p className="text-green-100 mt-1">Step {currentStep} of {totalSteps}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-green-700 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-green-500 bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter item name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      placeholder="Stock Keeping Unit"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Detailed description of the item"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    >
                      {categoryOptions.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Barcode</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={formData.barcode}
                        onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                        placeholder="Scan or enter barcode"
                      />
                      <ScanLine className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Stock & Pricing */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock & Pricing Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Quantity *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    >
                      {unitOptions.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.condition}
                      onChange={(e) => setFormData({...formData, condition: e.target.value as any})}
                    >
                      <option value="new">New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                      <option value="damaged">Damaged</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Stock</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.maxStock}
                      onChange={(e) => setFormData({...formData, maxStock: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Point</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.reorderPoint}
                      onChange={(e) => setFormData({...formData, reorderPoint: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({...formData, costPrice: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({...formData, sellingPrice: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Profit Margin Display */}
                {formData.costPrice! > 0 && formData.sellingPrice! > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-green-800">
                      <strong>Profit Margin: </strong>
                      ${(formData.sellingPrice! - formData.costPrice!).toFixed(2)} 
                      ({(((formData.sellingPrice! - formData.costPrice!) / formData.costPrice!) * 100).toFixed(1)}%)
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Location & Supplier */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Supplier Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Supplier *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      placeholder="Supplier name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Storage Location *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g., Warehouse A, Section B, Shelf 3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch Number</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.batchNumber}
                      onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
                      placeholder="Batch/Lot number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturing Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.manufacturedDate}
                      onChange={(e) => setFormData({...formData, manufacturedDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Additional Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Add tags separated by commas"
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                        setFormData({...formData, tags});
                      }}
                    />
                    <p className="text-sm text-gray-500 mt-1">e.g., organic, premium, seasonal</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Additional notes or special instructions"
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Item Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{formData.name || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">SKU:</span>
                        <span className="ml-2 font-medium">{formData.sku || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <span className="ml-2 font-medium">{formData.quantity} {formData.unit}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Value:</span>
                        <span className="ml-2 font-medium">${((formData.quantity || 0) * (formData.sellingPrice || 0)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {currentStep === 1 ? 'Cancel' : 'Previous'}
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={currentStep === 1 && (!formData.name || !formData.sku)}
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Add Item
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Stock Movement Modal
const StockMovementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onUpdateStock: (itemId: string, movement: Partial<StockMovement>) => void;
}> = ({ isOpen, onClose, item, onUpdateStock }) => {
  const [movementData, setMovementData] = useState({
    type: 'in' as 'in' | 'out' | 'adjustment',
    quantity: 0,
    reference: '',
    notes: ''
  });

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStock(item.id, movementData);
    setMovementData({ type: 'in', quantity: 0, reference: '', notes: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Stock Movement</h2>
            <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-blue-100 mt-1">{item.name}</p>
          <p className="text-blue-200 text-sm">Current Stock: {item.quantity} {item.unit}</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Movement Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={movementData.type}
                onChange={(e) => setMovementData({...movementData, type: e.target.value as any})}
              >
                <option value="in">Stock In</option>
                <option value="out">Stock Out</option>
                <option value="adjustment">Adjustment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={movementData.quantity}
                onChange={(e) => setMovementData({...movementData, quantity: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={movementData.reference}
                onChange={(e) => setMovementData({...movementData, reference: e.target.value})}
                placeholder="PO#, Invoice#, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={movementData.notes}
                onChange={(e) => setMovementData({...movementData, notes: e.target.value})}
                placeholder="Additional notes..."
              />
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm">
                <span className="text-gray-600">New Stock Level: </span>
                <span className="font-medium">
                  {movementData.type === 'in' 
                    ? item.quantity + movementData.quantity
                    : movementData.type === 'out'
                    ? Math.max(0, item.quantity - movementData.quantity)
                    : movementData.quantity
                  } {item.unit}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Stock
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const InventoryDashboard: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [filters, setFilters] = useState<InventoryFilters>({});
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'price' | 'updated'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch inventory data
  useEffect(() => {
    fetchInventoryData();
    fetchInventoryStats();
  }, [filters, sortBy, sortOrder]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (typeof value === 'object') {
            queryParams.append(key, JSON.stringify(value));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
      queryParams.append('sortBy', sortBy);
      queryParams.append('sortOrder', sortOrder);
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', itemsPerPage.toString());

      const response = await fetch(`${API_BASE_URL}/inventory?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch inventory');
      
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddItem = async (newItem: Partial<InventoryItem>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      
      if (!response.ok) throw new Error('Failed to add item');
      
      fetchInventoryData();
      fetchInventoryStats();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleUpdateStock = async (itemId: string, movement: Partial<StockMovement>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/${itemId}/movement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movement),
      });
      
      if (!response.ok) throw new Error('Failed to update stock');
      
      fetchInventoryData();
      fetchInventoryStats();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleDeleteItems = async (ids: string[]) => {
    if (!confirm(`Are you sure you want to delete ${ids.length} item(s)?`)) return;
    
    try {
      await Promise.all(
        ids.map(id =>
          fetch(`${API_BASE_URL}/inventory/${id}`, { method: 'DELETE' })
        )
      );
      
      setSelectedItems([]);
      fetchInventoryData();
      fetchInventoryStats();
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters, selectedItems })
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `inventory-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'text-green-700 bg-green-100 border-green-200';
      case 'low-stock': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'out-of-stock': return 'text-red-700 bg-red-100 border-red-200';
      case 'expired': return 'text-gray-700 bg-gray-100 border-gray-200';
      case 'damaged': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'reserved': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'text-green-700 bg-green-50';
      case 'good': return 'text-blue-700 bg-blue-50';
      case 'fair': return 'text-yellow-700 bg-yellow-50';
      case 'poor': return 'text-orange-700 bg-orange-50';
      case 'damaged': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      seeds: '🌱',
      fertilizers: '🧪',
      pesticides: '🚿',
      organic: '🌿',
      equipment: '🚜',
      tools: '🔧',
      irrigation: '💧',
      chemicals: '⚗️'
    };
    return icons[category as keyof typeof icons] || '📦';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const sortedItems = [...items].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'name':
        return multiplier * a.name.localeCompare(b.name);
      case 'quantity':
        return multiplier * (a.quantity - b.quantity);
      case 'price':
        return multiplier * (a.sellingPrice - b.sellingPrice);
      case 'updated':
        return multiplier * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      default:
        return 0;
    }
  });

  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 rounded-xl">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventory Lab</h1>
                <p className="text-gray-600 mt-1">Professional Agricultural Inventory Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </button>
              
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={handleExport}
                  className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </button>
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Primary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalItems.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1">+12% from last month</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.totalValue)}</p>
                  <p className="text-sm text-green-600 mt-1">+8% from last month</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Alert</p>
                  <p className="text-3xl font-bold text-amber-600 mt-2">{stats.lowStockItems}</p>
                  <p className="text-sm text-gray-500 mt-1">Needs attention</p>
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stats.expiringSoon}</p>
                  <p className="text-sm text-gray-500 mt-1">Next 30 days</p>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-xl">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {Object.entries(stats.categories).map(([category, data]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCategoryIcon(category)}</span>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{category.replace('-', ' ')}</p>
                        <p className="text-sm text-gray-500">{data.count} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(data.value)}</p>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((data.value / stats.totalValue) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Suppliers</h3>
                <Truck className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {stats.topSuppliers.slice(0, 5).map((supplier, index) => (
                  <div key={supplier.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{supplier.name}</p>
                        <p className="text-sm text-gray-500">{supplier.items} items</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">{formatCurrency(supplier.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 lg:mr-6">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inventory items, SKU, or barcode..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  value={filters.search || ''}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-3 border rounded-xl transition-colors ${
                  showFilters ? 'bg-green-50 border-green-200 text-green-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <select
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
              >
                <option value="updated-desc">Recently Updated</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="quantity-desc">Quantity (High-Low)</option>
                <option value="quantity-asc">Quantity (Low-High)</option>
                <option value="price-desc">Price (High-Low)</option>
                <option value="price-asc">Price (Low-High)</option>
              </select>

              {selectedItems.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteItems(selectedItems)}
                    className="flex items-center px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete ({selectedItems.length})
                  </button>
                  <button
                    onClick={() => setSelectedItems([])}
                    className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={filters.category || ''}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">All Categories</option>
                  <option value="seeds">🌱 Seeds & Saplings</option>
                  <option value="fertilizers">🧪 Fertilizers</option>
                  <option value="pesticides">🚿 Pesticides</option>
                  <option value="organic">🌿 Organic Products</option>
                  <option value="equipment">🚜 Equipment</option>
                  <option value="tools">🔧 Tools</option>
                  <option value="irrigation">💧 Irrigation</option>
                  <option value="chemicals">⚗️ Chemicals</option>
                </select>

                <select
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={filters.status || ''}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">All Status</option>
                  <option value="in-stock">✅ In Stock</option>
                  <option value="low-stock">⚠️ Low Stock</option>
                  <option value="out-of-stock">❌ Out of Stock</option>
                  <option value="expired">⏰ Expired</option>
                  <option value="damaged">🔧 Damaged</option>
                  <option value="reserved">📋 Reserved</option>
                </select>

                <select
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={filters.condition || ''}
                  onChange={(e) => setFilters({...filters, condition: e.target.value})}
                >
                  <option value="">All Conditions</option>
                  <option value="new">New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="damaged">Damaged</option>
                </select>

                <input
                  type="text"
                  placeholder="Filter by supplier..."
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={filters.supplier || ''}
                  onChange={(e) => setFilters({...filters, supplier: e.target.value})}
                />
              </div>
            </div>
          )}
        </div>

        {/* Inventory Items */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="text-gray-600">Loading inventory...</p>
              </div>
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first inventory item.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Item
              </button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(paginatedItems.map(item => item.id));
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([...selectedItems, item.id]);
                            } else {
                              setSelectedItems(selectedItems.filter(id => id !== item.id));
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{getCategoryIcon(item.category)}</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                              {item.tags && item.tags.length > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {item.tags[0]}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                              {item.barcode && (
                                <p className="text-sm text-gray-500">Barcode: {item.barcode}</p>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-400 mt-1 truncate max-w-xs">{item.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 capitalize">{item.category.replace('-', ' ')}</p>
                          {item.subcategory && (
                            <p className="text-gray-500">{item.subcategory}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{item.quantity} {item.unit}</p>
                            {item.quantity <= item.minStock && (
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            Min: {item.minStock} | Reorder: {item.reorderPoint}
                          </div>
                          {item.reservedQuantity > 0 && (
                            <div className="text-blue-600 text-xs">
                              Reserved: {item.reservedQuantity} {item.unit}
                            </div>
                          )}
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                item.quantity <= item.minStock ? 'bg-red-500' :
                                item.quantity <= item.reorderPoint ? 'bg-amber-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((item.quantity / item.maxStock) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{formatCurrency(item.sellingPrice)}</p>
                          <p className="text-gray-500">Cost: {formatCurrency(item.costPrice)}</p>
                          {item.costPrice > 0 && (
                            <p className="text-green-600 text-xs">
                              Margin: {(((item.sellingPrice - item.costPrice) / item.costPrice) * 100).toFixed(1)}%
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {item.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${getConditionColor(item.condition)}`}>
                            {item.condition.toUpperCase()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-900">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {item.location}
                          </div>
                          {item.zone && (
                            <p className="text-gray-500 text-xs mt-1">Zone: {item.zone}</p>
                          )}
                          {item.shelf && (
                            <p className="text-gray-500 text-xs">Shelf: {item.shelf}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowStockModal(true);
                            }}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Update Stock"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {/* Handle view details */}}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {/* Handle edit */}}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Item"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <div className="relative group">
                            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              <button
                                onClick={() => handleDeleteItems([item.id])}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-t-lg"
                              >
                                <Trash2 className="w-4 h-4 inline mr-2" />
                                Delete Item
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <Archive className="w-4 h-4 inline mr-2" />
                                Archive Item
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg">
                                <Star className="w-4 h-4 inline mr-2" />
                                Mark as Favorite
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {paginatedItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{getCategoryIcon(item.category)}</div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }
                        }}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      {item.quantity <= item.minStock && (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">SKU: {item.sku}</p>
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stock:</span>
                      <span className="font-medium text-gray-900">{item.quantity} {item.unit}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.quantity <= item.minStock ? 'bg-red-500' :
                          item.quantity <= item.reorderPoint ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((item.quantity / item.maxStock) * 100, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(item.sellingPrice)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getStatusColor(item.status)}`}>
                        {item.status.replace('-', ' ')}
                      </span>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-20">{item.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowStockModal(true);
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Stock
                    </button>
                    <button
                      onClick={() => {/* Handle edit */}}
                      className="flex-1 px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItems([item.id])}
                      className="px-3 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedItems.length)} of {sortedItems.length} items
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-green-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />

      <StockMovementModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        item={selectedItem}
        onUpdateStock={handleUpdateStock}
      />
    </div>
  );
};

export default InventoryDashboard;