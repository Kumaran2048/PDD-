import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/api'
import { useLang } from '../../context/LanguageContext'

const CropAdvisor = () => {
  const { t } = useLang()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [soilType, setSoilType] = useState('Black Soil')
  const [season, setSeason] = useState('Kharif')
  const [activeGuide, setActiveGuide] = useState(null)
  const [selectedCropId, setSelectedCropId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, cropRes] = await Promise.allSettled([
          API.get('/farm/profile'),
          API.get('/crop/all')
        ])
        
        if (profRes.status === 'fulfilled') {
          const prof = profRes.value.data.profile
          setProfile(prof)
          if (prof.soilType) setSoilType(prof.soilType)
          setSelectedCropId(prof.activeCrop?._id)
        }
        
        if (cropRes.status === 'fulfilled') {
          setCrops(cropRes.value.data.crops || [])
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSelectCrop = async (cropId) => {
    try {
      setLoading(true)
      await API.put('/farm/select-crop', { cropId })
      setSelectedCropId(cropId)
      alert("Crop selected successfully! You can now view weather and irrigation advice.")
      navigate('/farmer/weather')
    } catch (err) {
      alert("Failed to select crop. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Filter crops based on selected soil and season
  const recommendedCrops = crops.filter(c => 
    c.soilTypes.includes(soilType) && c.season.includes(season)
  )

  if (loading) return <div className="loading-page"><div className="spinner spinner-dark"></div><p>Analyzing farm data...</p></div>

  return (
    <div style={{ background: '#F9FBF9', minHeight: '100%', paddingBottom: '5rem' }}>
      <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-dark)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <span>🌾</span> {t('cropAdvice') || 'AI Crop Advisor'}
        </div>
        <div style={{ fontSize: '0.9rem' }}>{t('home')} ▾</div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Seasonal Farm Planning</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>AI recommendations based on soil & weather</p>

        {/* Input Form */}
        <div className="glass-card" style={{ background: 'white', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Soil Type</label>
              <select className="input-field" value={soilType} onChange={(e) => setSoilType(e.target.value)} style={{ padding: '0.6rem' }}>
                <option>Black Soil</option>
                <option>Red Soil</option>
                <option>Alluvial Soil</option>
                <option>Loamy Soil</option>
                <option>Sandy Soil</option>
                <option>Laterite Soil</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Season</label>
              <select className="input-field" value={season} onChange={(e) => setSeason(e.target.value)} style={{ padding: '0.6rem' }}>
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Zaid">Zaid (Summer)</option>
              </select>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', margin: '1rem 0' }}>
            Select your soil and season to see the best matches for your farm.
          </p>
        </div>

        {/* Results */}
        <div className="animate-up">
          {recommendedCrops.length > 0 ? recommendedCrops.map((crop, i) => (
            <div key={crop._id} className="glass-card" style={{ background: 'white', marginBottom: '1.5rem', borderLeft: `4px solid ${i === 0 ? 'var(--success)' : i === 1 ? '#3498DB' : '#F39C12'}`, position: 'relative' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)' }}>{crop.name}</h3>
                  {selectedCropId === crop._id && <span className="role-badge" style={{ background: '#E3F2FD', color: '#1976D2' }}>Currently Growing</span>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{i === 0 ? '98' : i === 1 ? '92' : '85'}%</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Suitability</div>
                </div>
              </div>

              <div style={{ background: '#F9FBF9', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-main)', border: '1px solid #E3E8E3' }}>
                <strong>🤖 AI Insight:</strong> {crop.description || 'Highly recommended for your region.'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>💧 Water Need</div>
                  <div style={{ fontWeight: 600 }}>{crop.waterNeed}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>⏳ Duration</div>
                  <div style={{ fontWeight: 600 }}>{crop.growingDurationDays} days</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>💰 Est. Yield</div>
                  <div style={{ fontWeight: 600, color: 'var(--success)' }}>{crop.expectedYieldPerAcre}</div>
                </div>
                <div>
                   <button 
                    className="btn btn-primary" 
                    onClick={() => handleSelectCrop(crop._id)}
                    disabled={selectedCropId === crop._id}
                    style={{ padding: '0.4rem', fontSize: '0.75rem', width: '100%' }}
                   >
                     {selectedCropId === crop._id ? 'Selected ✅' : 'Select Crop'}
                   </button>
                </div>
              </div>
              
              {activeGuide === crop._id && (
                <div className="animate-up" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed #E3E8E3' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-dark)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Cultivation Guide</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {crop.maintenanceTips?.map((tip, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '0.5rem' }}><strong>•</strong> {tip}</li>
                    ))}
                    <li style={{ display: 'flex', gap: '0.5rem' }}><strong>🧪 Fertilizer:</strong> {crop.fertilizerSchedule?.[0]?.instruction}</li>
                    <li style={{ display: 'flex', gap: '0.5rem' }}><strong>🌧️ Watering:</strong> {crop.wateringSchedule?.frequency}</li>
                  </ul>
                </div>
              )}
              
              <button 
                className="btn btn-outline" 
                onClick={() => setActiveGuide(activeGuide === crop._id ? null : crop._id)}
                style={{ width: '100%', marginTop: '1rem', padding: '0.6rem', fontSize: '0.85rem' }}
              >
                {activeGuide === crop._id ? 'Hide Guide ↑' : 'View Guide →'}
              </button>
            </div>
          )) : (
            <div className="empty-state">
               <div style={{ fontSize: '3rem' }}>🔍</div>
               <p>No crops matching your soil and season were found. Try another combination.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CropAdvisor
