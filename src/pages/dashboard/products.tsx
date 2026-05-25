import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { authFetch } from '../../services/api';
import {
  Upload,
  Download,
  Plus,
  Save,
  Edit3,
  X,
  AlertTriangle,
  ShieldAlert,
  Lock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  HelpCircle,
  FileSpreadsheet,
  Search,
  Check
} from 'lucide-react';

interface Product {
  id: number;
  external_id: string;
  name: string;
  list_price: number;
  mam: number;
  currency: string;
  active: boolean;
  created_at: string;
  updated_at: string | null;
}

interface UploadError {
  row?: number;
  message?: string;
  detail?: string;
  [key: string]: any;
}

interface UploadFeedback {
  inserted: number;
  updated: number;
  skipped: number;
  errors: UploadError[];
}

const ProductsDashboard = () => {
  // Page state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // CSV Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<UploadFeedback | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  // Inline editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    list_price: '',
    mam: '',
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  // Manual Add Form state
  const [showManualForm, setShowManualForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    external_id: '',
    name: '',
    list_price: '',
    mam: '',
    currency: 'PKR',
    active: true,
  });

  // Fetch products catalog
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authFetch('/api/saas/products/');
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || 'Failed to load the product catalog.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On mount check auth & fetch
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      window.location.href = '/auth/login';
    } else {
      fetchProducts();
    }
  }, [fetchProducts]);

  // CSV Template download content (Data URI)
  const getCsvTemplateUri = () => {
    const headers = 'external_id,name,list_price,mam,currency';
    const sampleRows = [
      'PROD-100,Premium Negotiator Widget,50.00,40.00,USD',
      'PROD-200,Enterprise Analytics Dashboard,120.00,95.00,USD',
      'PROD-300,SaaS Integration Plugin,2500.00,1800.00,PKR',
    ].join('\n');
    const csvContent = `${headers}\n${sampleRows}`;
    return `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
  };

  // Handle CSV file upload
  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setUploadFeedback(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await authFetch('/api/saas/products/upload', 'POST', formData);
      const result: UploadFeedback = await response.json();
      
      setUploadFeedback(result);
      // Reset input element value to allow re-upload of same file
      e.target.value = '';
      
      // Refresh products table to show new data
      await fetchProducts();
    } catch (err: any) {
      console.error("CSV Upload failed:", err);
      setError(err.message || 'Failed to upload CSV file.');
    } finally {
      setIsUploading(false);
    }
  };

  // Start inline edit mode
  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      list_price: product.list_price.toString(),
      mam: product.mam.toString(),
    });
    setInlineError(null);
  };

  // Save inline edits
  const saveEdit = async (productId: number) => {
    setInlineError(null);
    const listPriceNum = parseFloat(editForm.list_price);
    const mamNum = parseFloat(editForm.mam);

    if (isNaN(listPriceNum) || listPriceNum <= 0) {
      setInlineError("List price must be a positive number.");
      return;
    }
    if (isNaN(mamNum) || mamNum < 0) {
      setInlineError("MAM must be a positive number.");
      return;
    }
    if (mamNum > listPriceNum) {
      setInlineError("Confidential MAM cannot exceed List Price.");
      return;
    }

    setIsSavingEdit(true);
    try {
      const payload = {
        list_price: listPriceNum,
        mam: mamNum,
      };
      
      await authFetch(`/api/saas/products/${productId}`, 'PUT', payload);
      setEditingId(null);
      await fetchProducts();
    } catch (err: any) {
      console.error("Inline edit failed:", err);
      setInlineError(err.message || "Failed to update product prices.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Add Product manually
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessBanner(null);

    const listPriceNum = parseFloat(newProduct.list_price);
    const mamNum = parseFloat(newProduct.mam);

    if (!newProduct.external_id.trim()) {
      setFormError("External ID is required.");
      return;
    }
    if (!newProduct.name.trim()) {
      setFormError("Product Name is required.");
      return;
    }
    if (isNaN(listPriceNum) || listPriceNum <= 0) {
      setFormError("List Price must be a valid positive number.");
      return;
    }
    if (isNaN(mamNum) || mamNum < 0) {
      setFormError("MAM must be a valid positive number.");
      return;
    }
    if (mamNum > listPriceNum) {
      setFormError("Confidential MAM cannot exceed List Price.");
      return;
    }

    setIsAdding(true);
    
    const payload = {
      external_id: newProduct.external_id.trim(),
      name: newProduct.name.trim(),
      list_price: listPriceNum,
      mam: mamNum,
      currency: newProduct.currency,
      active: newProduct.active
    };

    try {
      // Attempt standard POST request (may return 405/404 if route is undocumented/unsupported)
      console.log("Sending manual product add POST...");
      await authFetch('/api/saas/products/', 'POST', payload);
      
      // Success
      setSuccessBanner(`Product "${payload.name}" added successfully.`);
      resetManualForm();
      await fetchProducts();
    } catch (err: any) {
      console.warn("Direct POST failed, attempting CSV upload fallback...", err);
      
      // Fallback: Create a single-row CSV on-the-fly and upload it
      try {
        const headers = 'external_id,name,list_price,mam,currency';
        // Handle double quotes in csv fields
        const safeName = payload.name.replace(/"/g, '""');
        const row = `"${payload.external_id}","${safeName}",${payload.list_price},${payload.mam},"${payload.currency}"`;
        const csvContent = `${headers}\n${row}`;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const file = new File([blob], 'single_product_add.csv', { type: 'text/csv' });

        const formData = new FormData();
        formData.append('file', file);

        const response = await authFetch('/api/saas/products/upload', 'POST', formData);
        const result: UploadFeedback = await response.json();

        if (result.skipped > 0) {
          const skipMsg = result.errors?.[0]?.message || 'Skipped due to validation error';
          throw new Error(skipMsg);
        }

        setSuccessBanner(`Product "${payload.name}" uploaded successfully.`);
        resetManualForm();
        await fetchProducts();
      } catch (fallbackErr: any) {
        console.error("Fallback upload failed:", fallbackErr);
        setFormError(fallbackErr.message || "Failed to add product.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const resetManualForm = () => {
    setNewProduct({
      external_id: '',
      name: '',
      list_price: '',
      mam: '',
      currency: 'PKR',
      active: true,
    });
  };

  // Filter products by search query
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.external_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle="Product Catalog Management">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Confidentiality Warning Header */}
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0 animate-pulse" />
          <div className="text-sm">
            <h3 className="font-semibold text-red-200">Strict Data Confidentiality Protocol (MAM Protection)</h3>
            <p className="text-slate-400 mt-1">
              The <strong className="text-red-400">Minimum Acceptable Price (MAM)</strong> is used exclusively as a backend negotiation boundary. 
              It is strictly confidential tenant data and is <strong>never surfaced</strong> in the public storefront widget or sent within public consumer API responses. 
              Always verify you are in a secure environment when managing MAM figures.
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Section A - CSV Upload & Template */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Upload className="h-5 w-5 text-violet-400" />
                CSV Bulk Import
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Bulk upsert products into your negotiation library. Rows matching existing <code className="text-violet-400">external_id</code> values will be updated automatically, and new rows will be inserted.
              </p>
            </div>

            <div className="space-y-4">
              {/* Styled File Input Zone */}
              <div className="relative group border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-xl p-6 transition flex flex-col items-center justify-center bg-slate-900/40 cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
                    <p className="text-sm text-slate-300">Processing file and matching catalog...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="p-3 bg-violet-600/15 border border-violet-500/30 rounded-full group-hover:bg-violet-600/25 transition">
                      <FileSpreadsheet className="h-6 w-6 text-violet-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-300">Drag & drop your CSV file here, or <span className="text-violet-400 group-hover:underline">browse</span></p>
                    <p className="text-xs text-slate-500">Supports standard CSV files up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sample Template Card */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Download className="h-5 w-5 text-emerald-400" />
                Template Standard
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                To guarantee successful importing, structure your CSV spreadsheet with these exact header names:
              </p>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-white/5 font-mono text-xs text-slate-400 space-y-1.5 overflow-x-auto">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-slate-200">Header</span>
                  <span className="text-violet-400">Context</span>
                </div>
                <div className="flex justify-between"><span>external_id</span> <span className="text-slate-500">SKU / ID</span></div>
                <div className="flex justify-between"><span>name</span> <span className="text-slate-500">Product Name</span></div>
                <div className="flex justify-between"><span>list_price</span> <span className="text-slate-500">Market Price</span></div>
                <div className="flex justify-between"><span>mam</span> <span className="text-red-400/80">Confidential Floor</span></div>
                <div className="flex justify-between"><span>currency</span> <span className="text-slate-500">USD/PKR/etc.</span></div>
              </div>
            </div>

            <a
              href={getCsvTemplateUri()}
              download="bargainbaas_products_template.csv"
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 transition text-center"
            >
              <Download className="h-4 w-4" />
              Download Template (.csv)
            </a>
          </div>
        </div>

        {/* Upload Feedback Banner */}
        {uploadFeedback && (
          <div className="p-5 rounded-2xl border border-violet-500/30 bg-violet-500/5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-violet-600/20 border border-violet-500/30 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Import Complete</h4>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {uploadFeedback.inserted + uploadFeedback.updated} products uploaded, {uploadFeedback.skipped} rows skipped with validation errors.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setUploadFeedback(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl">
                <div className="text-xs text-slate-500 uppercase">Inserted (New)</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{uploadFeedback.inserted}</div>
              </div>
              <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl">
                <div className="text-xs text-slate-500 uppercase">Updated (Merged)</div>
                <div className="text-xl font-bold text-violet-400 mt-1">{uploadFeedback.updated}</div>
              </div>
              <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl">
                <div className="text-xs text-slate-500 uppercase">Skipped</div>
                <div className="text-xl font-bold text-amber-400 mt-1">{uploadFeedback.skipped}</div>
              </div>
            </div>

            {uploadFeedback.errors.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setShowErrorDetails(!showErrorDetails)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition focus:outline-none"
                >
                  {showErrorDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {showErrorDetails ? "Hide" : "Show"} Detailed Row Validation Errors ({uploadFeedback.errors.length})
                </button>
                
                {showErrorDetails && (
                  <div className="mt-3 max-h-48 overflow-y-auto rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 space-y-2">
                    {uploadFeedback.errors.map((err, idx) => (
                      <div key={idx} className="text-xs font-mono text-amber-300 flex items-start gap-2">
                        <span className="font-bold flex-shrink-0">Row {err.row || idx + 1}:</span>
                        <span>{err.message || err.detail || JSON.stringify(err)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Section B - Dynamic Data Table */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Product Catalog</h2>
              <p className="text-sm text-slate-400 mt-0.5">Active inventory and automated bargaining policies</p>
            </div>

            {/* Client-side Search filter */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/40 text-slate-400 font-medium text-sm">
                  <th className="p-4">External ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">List Price</th>
                  <th className="p-4">
                    <span className="flex items-center gap-1.5 group cursor-help text-red-300/90 font-semibold">
                      <Lock className="h-3.5 w-3.5 text-red-400" />
                      MAM
                      <span className="relative">
                        <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                        {/* Hover Tooltip */}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded bg-slate-950 border border-red-500/30 text-[10px] font-normal leading-normal text-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition duration-200 z-20 shadow-xl">
                          Minimum Acceptable Price. Strictly confidential backend boundary. Never surfaced to clients.
                        </span>
                      </span>
                    </span>
                  </th>
                  <th className="p-4">Currency</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 text-violet-400 animate-spin" />
                        <p className="text-slate-500">Retrieving catalog records...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500">
                      No products found. Upload a CSV or use the manual add form below.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const isEditing = editingId === product.id;
                    return (
                      <tr key={product.id} className="hover:bg-white/[0.02] transition">
                        <td className="p-4 font-mono font-medium text-slate-400">{product.external_id}</td>
                        <td className="p-4 text-white font-medium">{product.name}</td>
                        
                        {/* List Price cell */}
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.list_price}
                              onChange={(e) => setEditForm({ ...editForm, list_price: e.target.value })}
                              className="w-24 px-2.5 py-1 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500"
                            />
                          ) : (
                            <span>{product.list_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          )}
                        </td>

                        {/* MAM cell - Confidential styling */}
                        <td className="p-4 bg-red-950/5">
                          {isEditing ? (
                            <div className="relative flex items-center">
                              <input
                                type="number"
                                step="0.01"
                                value={editForm.mam}
                                onChange={(e) => setEditForm({ ...editForm, mam: e.target.value })}
                                className="w-24 pl-6 pr-2.5 py-1 bg-slate-900 border border-red-500/30 rounded-lg text-red-200 text-sm focus:outline-none focus:border-red-500"
                              />
                              <Lock className="absolute left-2 h-3 w-3 text-red-400" />
                            </div>
                          ) : (
                            <span className="flex items-center gap-1 text-red-400/90 font-mono">
                              <Lock className="h-3 w-3 text-red-500/60" />
                              {product.mam.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-slate-400 font-mono">{product.currency}</td>
                        
                        {/* Status cell */}
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            product.active 
                              ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400'
                              : 'bg-slate-800 border-white/10 text-slate-500'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${product.active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                            {product.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Actions cell */}
                        <td className="p-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => saveEdit(product.id)}
                                disabled={isSavingEdit}
                                className="p-1 text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 rounded transition disabled:opacity-40"
                                title="Save"
                              >
                                {isSavingEdit ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                disabled={isSavingEdit}
                                className="p-1 text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded transition"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditing(product)}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg transition"
                              title="Edit price variables"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Inline Edit Error Box */}
          {inlineError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              {inlineError}
            </div>
          )}
        </div>

        {/* Section C - Manual Add Form Section */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Manual Entry</h2>
              <p className="text-xs text-slate-500 mt-0.5">Directly catalog a single product without upload templates</p>
            </div>
            
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600/20 border border-violet-500/30 text-violet-400 hover:bg-violet-600/30 transition"
            >
              {showManualForm ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showManualForm ? "Collapse Drawer" : "Add Single Product"}
            </button>
          </div>

          {successBanner && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {successBanner}
            </div>
          )}

          {showManualForm && (
            <form onSubmit={handleAddProduct} className="p-5 rounded-xl border border-white/5 bg-slate-900/30 space-y-4 transition">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* External ID */}
                <div className="space-y-1">
                  <label htmlFor="external_id" className="text-xs font-semibold text-slate-400">External ID / SKU</label>
                  <input
                    type="text"
                    id="external_id"
                    placeholder="e.g. SK-5001"
                    value={newProduct.external_id}
                    onChange={(e) => setNewProduct({ ...newProduct, external_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                {/* Name */}
                <div className="space-y-1 lg:col-span-2">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-400">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="e.g. Negotiation Assistant API Widget"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                {/* Currency */}
                <div className="space-y-1">
                  <label htmlFor="currency" className="text-xs font-semibold text-slate-400">Trading Currency</label>
                  <select
                    id="currency"
                    value={newProduct.currency}
                    onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-violet-500"
                  >
                    <option value="PKR">PKR (₨)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-2 self-end pb-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={newProduct.active}
                    onChange={(e) => setNewProduct({ ...newProduct, active: e.target.checked })}
                    className="h-4 w-4 rounded border-white/10 bg-slate-950 text-violet-600 focus:ring-violet-500/50"
                  />
                  <label htmlFor="active" className="text-xs font-semibold text-slate-400 cursor-pointer">Surfaced & Active</label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* List Price */}
                <div className="space-y-1">
                  <label htmlFor="list_price" className="text-xs font-semibold text-slate-400">List Price (Public Market Price)</label>
                  <input
                    type="number"
                    id="list_price"
                    step="0.01"
                    placeholder="0.00"
                    value={newProduct.list_price}
                    onChange={(e) => setNewProduct({ ...newProduct, list_price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                {/* MAM (Confidential warning box) */}
                <div className="space-y-1 p-3 rounded-xl border border-red-500/20 bg-red-500/5">
                  <label htmlFor="mam" className="text-xs font-semibold text-red-300 flex items-center gap-1">
                    <Lock className="h-3 w-3 text-red-400" />
                    Minimum Acceptable Price (MAM) - Confidential
                  </label>
                  <input
                    type="number"
                    id="mam"
                    step="0.01"
                    placeholder="0.00"
                    value={newProduct.mam}
                    onChange={(e) => setNewProduct({ ...newProduct, mam: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-red-500/30 rounded-xl text-sm text-red-200 placeholder-slate-600 focus:outline-none focus:border-red-500"
                  />
                  <p className="text-[10px] text-red-400/80 mt-1">
                    ⚠️ Floor price. Any bargain proposal below this is auto-rejected by the agent.
                  </p>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetManualForm}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition"
                >
                  Clear Fields
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-600/20"
                >
                  {isAdding && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create Record
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ProductsDashboard;
