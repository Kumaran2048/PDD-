import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAppData } from '../../contexts/AppDataContext';
import { Crop } from '../../types';
import { SearchIcon, PlusIcon, EditIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import API from '../../utils/api';
export const CropDatabase: React.FC = () => {
  const { crops, addCrop, deleteCrop } = useAppData();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: '',
    emoji: '🌿',
    avgYieldPerAcre: 5,
    soilTypes: ['Loamy Soil'],
    season: ['Kharif'],
    climate: 'Tropical',
    waterNeed: 'Medium' as 'Low' | 'Medium' | 'High'
  });

  const [aiSoil, setAiSoil] = useState('Loamy Soil');
  const [aiSeason, setAiSeason] = useState('Kharif');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ recommendedCrop: string; confidence: number } | null>(null);

  const handleAiRecommend = async () => {
    setAiLoading(true);
    setAiResult(null);

    const soilMap: Record<string, { n: number; p: number; k: number; ph: number }> = {
      'Loamy Soil': { n: 80, p: 45, k: 40, ph: 6.5 },
      'Sandy Soil': { n: 40, p: 25, k: 30, ph: 6.0 },
      'Clayey Soil': { n: 90, p: 50, k: 60, ph: 7.0 },
      'Black Soil': { n: 70, p: 40, k: 80, ph: 7.5 },
      'Red Soil': { n: 50, p: 30, k: 35, ph: 5.8 },
      'Alluvial Soil': { n: 100, p: 60, k: 50, ph: 6.8 }
    };

    const seasonMap: Record<string, { temperature: number; humidity: number; rainfall: number }> = {
      'Kharif': { temperature: 28, humidity: 85, rainfall: 200 },
      'Rabi': { temperature: 18, humidity: 50, rainfall: 40 },
      'Zaid': { temperature: 34, humidity: 40, rainfall: 20 }
    };

    const soilVals = soilMap[aiSoil] || soilMap['Loamy Soil'];
    const seasonVals = seasonMap[aiSeason] || seasonMap['Kharif'];
    const requestBody = {
      ...soilVals,
      ...seasonVals
    };

    try {
      const { data } = await API.post('/ml/recommend-crop', requestBody);
      if (data && data.recommendedCrop) {
        setAiResult({
          recommendedCrop: data.recommendedCrop,
          confidence: data.confidence || 95.0
        });
        toast.success(`AI suggested: ${data.recommendedCrop}!`);
      } else {
        toast.error('AI could not recommend a crop for these parameters.');
      }
    } catch (err) {
      toast.error('AI recommendation failed. Make sure server is running.');
    } finally {
      setAiLoading(false);
    }
  };

  const acceptAiRecommendation = () => {
    if (!aiResult) return;
    const emojiMap: Record<string, string> = {
      tomato: '🍅',
      potato: '🥔',
      wheat: '🌾',
      maize: '🌽',
      rice: '🌾',
      cotton: '☁️',
      jute: '🌱',
      coconut: '🥥',
      banana: '🍌',
      apple: '🍎',
      grapes: '🍇',
      orange: '🍊',
      papaya: '🥭',
      mango: '🥭',
      chilli: '🌶️',
      garlic: '🧄',
      ginger: '🌱',
      onion: '🧅',
      turmeric: '🌱',
      muskmelon: '🍈',
      watermelon: '🍉',
      pomegranate: '🍎'
    };

    const cropName = aiResult.recommendedCrop;
    const emoji = emojiMap[cropName.toLowerCase()] || '🌿';

    setNewCrop(prev => ({
      ...prev,
      name: cropName,
      emoji: emoji,
      soilTypes: [aiSoil],
      season: [aiSeason],
      climate: aiSeason === 'Rabi' ? 'Temperate' : 'Tropical'
    }));

    toast.success(`Populated form with AI suggestion: ${cropName}!`);
  };

  const filteredCrops = crops.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop.name) return toast.error('Crop name is required');
    
    // Format crop data matching backend sequelize model validation schema
    const cropData = {
      name: newCrop.name,
      season: newCrop.season,
      soilTypes: newCrop.soilTypes,
      waterNeed: newCrop.waterNeed || 'Medium',
      growingDurationDays: 90, // standard default
      expectedYieldPerAcre: `${newCrop.avgYieldPerAcre} quintals`,
      states: ["Maharashtra", "Tamil Nadu", "Karnataka"] // sensible defaults
    };

    await addCrop(cropData);
    setIsModalOpen(false);
    setNewCrop({
      name: '',
      emoji: '🌿',
      avgYieldPerAcre: 5,
      soilTypes: ['Loamy Soil'],
      season: ['Kharif'],
      climate: 'Tropical',
      waterNeed: 'Medium'
    });
    setAiResult(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this crop from the database?')) {
      await deleteCrop(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-1">
            Crop Database
          </h1>
          <p className="text-[var(--text-muted)]">
            Manage crop parameters for AI recommendations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search crops..."
              icon={<SearchIcon size={18} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-admin hover:bg-admin-light"
          >
            <PlusIcon size={18} /> Add Crop
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrops.map((crop) => (
          <Card key={crop.id} className="flex flex-col group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-2xl">
                  {crop.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[var(--text)]">
                    {crop.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Yield: {crop.avgYieldPerAcre} Q/acre
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleDelete(crop.id)}
                  className="p-1.5 text-gray-400 hover:text-danger transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  IDEAL SOIL
                </p>
                <div className="flex flex-wrap gap-1">
                  {crop.idealSoil.map((soil) => (
                    <Badge key={soil} variant="neutral" className="text-[10px]">
                      {soil}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  SEASONS
                </p>
                <div className="flex flex-wrap gap-1">
                  {crop.season.map((s) => (
                    <Badge key={s} variant="info" className="text-[10px]">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  LIVE PRICE
                </p>
                <p className="font-bold text-[var(--text)]">
                  ₹{crop.currentPrice.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  STATUS
                </p>
                <p className="font-bold text-success text-xs">
                  Connected to API
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Crop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 max-h-[90vh] overflow-y-auto shadow-2xl rounded-3xl">
            <h2 className="text-2xl font-serif font-black text-gray-800 dark:text-gray-100 mb-4">Add New Crop</h2>
            
            {/* ✨ AI Generator Sub-Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-emerald-950/20 dark:to-emerald-900/10 p-4 rounded-2xl border border-green-100 dark:border-green-900/30 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-green-800 dark:text-green-300 flex items-center gap-1.5 uppercase tracking-wider">
                  ✨ AI Crop Generator
                </h3>
              </div>
              <p className="text-[10px] text-green-700/80 dark:text-green-400/80 font-bold">
                Predict the best crop for a soil & season.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Soil Type</label>
                  <select 
                    value={aiSoil} 
                    onChange={(e) => setAiSoil(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border-none rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-100 shadow-sm"
                  >
                    <option value="Loamy Soil">Loamy Soil</option>
                    <option value="Sandy Soil">Sandy Soil</option>
                    <option value="Clayey Soil">Clayey Soil</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Red Soil">Red Soil</option>
                    <option value="Alluvial Soil">Alluvial Soil</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Season</label>
                  <select 
                    value={aiSeason} 
                    onChange={(e) => setAiSeason(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border-none rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-100 shadow-sm"
                  >
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid">Zaid (Summer)</option>
                  </select>
                </div>
              </div>

              <Button 
                type="button" 
                onClick={handleAiRecommend} 
                disabled={aiLoading}
                className="w-full bg-green-700 hover:bg-green-800 text-white text-xs py-2.5 rounded-xl font-bold transition-all"
              >
                {aiLoading ? 'Analyzing Parameters...' : '🔮 Fetch AI Recommendation'}
              </Button>

              {aiResult && (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-green-200/50 space-y-2 mt-2 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700 dark:text-gray-300">AI Suggested:</span>
                    <Badge variant="success" className="text-[9px] font-extrabold">
                      {aiResult.confidence}% match
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-lg text-green-800 dark:text-green-300 font-serif">
                      {aiResult.recommendedCrop}
                    </span>
                    <button 
                      type="button"
                      onClick={acceptAiRecommendation}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-3 py-1.5 rounded-lg font-black transition-colors"
                    >
                      ✓ Apply Suggestion
                    </button>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleAddCrop} className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <Input 
                    label="Crop Name" 
                    value={newCrop.name} 
                    onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                    placeholder="e.g. Cotton"
                    required
                  />
                </div>
                <div>
                  <Input 
                    label="Emoji" 
                    value={newCrop.emoji} 
                    onChange={(e) => setNewCrop({...newCrop, emoji: e.target.value})}
                    placeholder="🌿"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Yield (Q/Acre)" 
                  type="number"
                  value={newCrop.avgYieldPerAcre} 
                  onChange={(e) => setNewCrop({...newCrop, avgYieldPerAcre: Number(e.target.value)})}
                  required
                />
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Water Need</label>
                  <select 
                    value={newCrop.waterNeed} 
                    onChange={(e) => setNewCrop({...newCrop, waterNeed: e.target.value as 'Low' | 'Medium' | 'High'})}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-admin"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Soil Types (comma separated)</label>
                <input 
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold text-gray-800 dark:text-gray-100"
                  value={newCrop.soilTypes.join(', ')}
                  onChange={(e) => setNewCrop({...newCrop, soilTypes: e.target.value.split(',').map(s => s.trim())})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Seasons (comma separated)</label>
                <input 
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold text-gray-800 dark:text-gray-100"
                  value={newCrop.season.join(', ')}
                  onChange={(e) => setNewCrop({...newCrop, season: e.target.value.split(',').map(s => s.trim())})}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-admin">Create Crop</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};