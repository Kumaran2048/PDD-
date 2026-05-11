import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/api'
import { useLang } from '../../context/LanguageContext'

const SeasonalPlanning = () => {
  const { t } = useLang()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/insights/seasonal')
        setData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <div className="loading-page"><div className="spinner spinner-dark"></div><p>Analyzing seasonal trends...</p></div>

  return (
    <div style={{ background: '#F9FBF9', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', background: 'var(--primary-dark)', color: 'white', gap: '1rem' }}>
        <span onClick={() => navigate(-1)} style={{ fontSize: '1.2rem', cursor: 'pointer' }}>←</span>
        <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{t('planning') || 'Seasonal Planning'}</h2>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div className="premium-header" style={{ borderRadius: '1.5rem', marginBottom: '1.5rem', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Current Season</div>
          <h1 style={{ fontSize: '1.8rem', margin: '0.25rem 0' }}>{data?.season} 🌾</h1>
          <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>{data?.reasoning}</p>
        </div>

        <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Recommended Crops</h3>

        {data?.recommendations?.map((crop, i) => (
          <div key={crop._id || i} className="glass-card" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '1rem', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              {crop.name === 'Tomato' ? '🍅' : crop.name === 'Rice' ? '🌾' : '🌱'}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{crop.name}</h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration: {crop.growingDurationDays} days</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Yield: {crop.expectedYieldPerAcre}</div>
            </div>
            <button 
              onClick={() => navigate(`/farmer/crops`)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: 'none', background: 'var(--primary)', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}
            >
              Details
            </button>
          </div>
        ))}

        <div className="glass-card" style={{ marginTop: '2rem', background: '#E3F2FD', border: 'none' }}>
           <h4 style={{ margin: '0 0 0.5rem 0', color: '#1976D2' }}>💡 Expert Planning Tip</h4>
           <p style={{ margin: 0, fontSize: '0.85rem', color: '#1565C0', lineHeight: '1.4' }}>
             Sowing in the first week of {data?.season === 'Kharif' ? 'June' : 'November'} is recommended for maximum yield and minimum pest interference this year.
           </p>
        </div>
      </div>
    </div>
  )
}

export default SeasonalPlanning
