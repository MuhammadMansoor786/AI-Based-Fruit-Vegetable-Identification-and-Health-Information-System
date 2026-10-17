import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  BarChart3,
  Layers,
  MessageSquare,
  X,
  FileCheck,
} from 'lucide-react';
import type { ProduceItem, FeedbackReport } from '../types/produce.ts';

interface AdminPanelProps {
  items: ProduceItem[];
  onAddNewProduce: (item: ProduceItem) => void;
  onDeleteProduce: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  items,
  onAddNewProduce,
  onDeleteProduce,
}) => {
  const [stats, setStats] = useState({
    totalScans: 48,
    accuracyRate: 97,
    produceDatabaseCount: items.length,
    feedbackReports: [] as FeedbackReport[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Produce Form State
  const [newForm, setNewForm] = useState<Partial<ProduceItem>>({
    name: '',
    scientificName: '',
    urduName: '',
    category: 'fruit',
    subCategory: '',
    family: '',
    imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
    origin: '',
    climate: 'Subtropical',
    varieties: ['Standard'],
    description: '',
    nutritionPer100g: {
      calories: 50,
      waterPercent: 85,
      carbsG: 12,
      sugarsG: 9,
      fiberG: 2.5,
      proteinG: 1,
      fatG: 0.2,
      vitaminC_mg: 25,
      vitaminA_mcg: 10,
      vitaminK_mcg: 5,
      potassium_mg: 200,
      calcium_mg: 15,
      iron_mg: 0.3,
      magnesium_mg: 12,
      folate_mcg: 20,
    },
    precautions: {
      diabetes: {
        glycemicIndex: 40,
        category: 'Low',
        suitability: 'Safe',
        advice: 'Safe in standard dietary portions.',
      },
      kidneyDisease: {
        potassiumTier: 'Low Potassium',
        oxalateLevel: 'Low',
        advice: 'Kidney friendly in moderate amounts.',
      },
      hypertension: {
        advice: 'Low in sodium, safe for blood pressure.',
      },
      allergiesAndInteractions: [],
      contraindications: [],
    },
    healthBenefits: [
      {
        title: 'Antioxidant Defense',
        description: 'Contains natural phytochemicals supporting cellular immunity.',
        targetedSystem: 'Immune',
      },
    ],
    recommendedServing: '1 medium fruit (approx 120g)',
    culinaryUses: ['Fresh eating', 'Salads'],
    storageTips: 'Refrigerate in crisper drawer.',
    sources: [
      { name: 'USDA FoodData Central', organization: 'USDA' },
    ],
  });

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setStats({
          totalScans: data.totalScans,
          accuracyRate: data.accuracyRate,
          produceDatabaseCount: data.produceDatabaseCount || items.length,
          feedbackReports: data.feedbackReports || [],
        });
      }
    } catch (err) {
      console.warn('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCreateProduce = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.category) return;

    const id = newForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const completeItem: ProduceItem = {
      ...(newForm as ProduceItem),
      id,
      growingSeason: ['Year-round'],
      cultivationRegions: ['Global'],
      isVerified: true,
    };

    onAddNewProduce(completeItem);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Curator & Admin Management
            </h1>
            <span className="bg-stone-900 text-stone-100 text-xs px-2.5 py-0.5 rounded-full font-mono">
              v1.2.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Audit AI recognition reports, review accuracy metrics, and manage USDA FoodData Central & FAO botanical records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="p-2 border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600 transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Produce Record
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs text-stone-500 font-medium">Total AI Image Scans</span>
          <p className="text-2xl font-extrabold text-stone-900">{stats.totalScans}</p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Powered by Gemini Vision
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs text-stone-500 font-medium">Model Accuracy Rating</span>
          <p className="text-2xl font-extrabold text-stone-900">{stats.accuracyRate}%</p>
          <span className="text-[11px] text-stone-400">Based on user confirmations</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs text-stone-500 font-medium">Verified Produce Library</span>
          <p className="text-2xl font-extrabold text-stone-900">{items.length}</p>
          <span className="text-[11px] text-stone-400">USDA & FAO Sourced</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs text-stone-500 font-medium">User Feedback Reports</span>
          <p className="text-2xl font-extrabold text-stone-900">{stats.feedbackReports.length}</p>
          <span className="text-[11px] text-stone-400">Accuracy audit log</span>
        </div>
      </div>

      {/* Produce Database Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Verified Botanical & Nutrition Records ({items.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50/80 text-stone-400 uppercase font-bold text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Produce</th>
                <th className="py-3 px-4">Urdu Name</th>
                <th className="py-3 px-4">Scientific Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Calories</th>
                <th className="py-3 px-4">Diabetic Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-4 font-bold text-stone-900 flex items-center gap-2">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    {item.name}
                  </td>
                  <td className="py-3 px-4 font-serif text-emerald-800 text-sm">{item.urduName}</td>
                  <td className="py-3 px-4 italic font-serif text-stone-500">{item.scientificName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-stone-100 text-stone-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">{item.nutritionPer100g.calories} kcal</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.precautions.diabetes.suitability === 'Safe'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.precautions.diabetes.suitability}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteProduce(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Feedback & Reports Log */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          Recent User Recognition Feedback & Verification Audit
        </h3>

        {stats.feedbackReports.length === 0 ? (
          <p className="text-xs text-stone-400">No user feedback logs recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {stats.feedbackReports.map((report) => (
              <div
                key={report.id}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{report.produceName}</span>
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        report.feedbackType === 'accurate'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {report.feedbackType}
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px] mt-0.5">{report.userComment}</p>
                </div>
                <span className="text-[10px] text-stone-400 shrink-0">
                  {new Date(report.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Produce Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">Add New Produce Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduce} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Common English Name</label>
                <input
                  type="text"
                  required
                  value={newForm.name || ''}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  placeholder="e.g., Pomegranate"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Scientific Botanical Name</label>
                  <input
                    type="text"
                    required
                    value={newForm.scientificName || ''}
                    onChange={(e) => setNewForm({ ...newForm, scientificName: e.target.value })}
                    placeholder="e.g., Punica granatum"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Urdu Name</label>
                  <input
                    type="text"
                    required
                    value={newForm.urduName || ''}
                    onChange={(e) => setNewForm({ ...newForm, urduName: e.target.value })}
                    placeholder="e.g., انار (Anaar)"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={newForm.category}
                    onChange={(e: any) => setNewForm({ ...newForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium"
                  >
                    <option value="fruit">Fruit</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="herb">Herb</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Botanical Family</label>
                  <input
                    type="text"
                    value={newForm.family || ''}
                    onChange={(e) => setNewForm({ ...newForm, family: e.target.value })}
                    placeholder="e.g., Lythraceae"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Calories (100g)</label>
                  <input
                    type="number"
                    value={newForm.nutritionPer100g?.calories || 50}
                    onChange={(e) =>
                      setNewForm({
                        ...newForm,
                        nutritionPer100g: {
                          ...newForm.nutritionPer100g!,
                          calories: parseInt(e.target.value, 10) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Fiber (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newForm.nutritionPer100g?.fiberG || 2.5}
                    onChange={(e) =>
                      setNewForm({
                        ...newForm,
                        nutritionPer100g: {
                          ...newForm.nutritionPer100g!,
                          fiberG: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Vitamin C (mg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newForm.nutritionPer100g?.vitaminC_mg || 20}
                    onChange={(e) =>
                      setNewForm({
                        ...newForm,
                        nutritionPer100g: {
                          ...newForm.nutritionPer100g!,
                          vitaminC_mg: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Photo Image URL</label>
                <input
                  type="url"
                  value={newForm.imageUrl || ''}
                  onChange={(e) => setNewForm({ ...newForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
