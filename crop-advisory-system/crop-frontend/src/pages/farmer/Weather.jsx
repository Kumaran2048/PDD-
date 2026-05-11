import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/api'
import { useLang } from '../../context/LanguageContext'

const Weather = () => {
  const { t } = useLang()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [weather, setWeather]   = useState(null)
  const [forecast, setForecast] = useState([])
  const [advisory, setAdvisory] = useState('')
  const [impacts, setImpacts]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const profileRes = await API.get('/farm/profile')
        const prof = profileRes.data.profile
        setProfile(prof)

        if (prof?.activeCrop) {
          const [currRes, foreRes] = await Promise.allSettled([
            API.get('/weather/current'),
            API.get('/weather/forecast'),
          ])
          if (currRes.status === 'fulfilled') {
            setWeather(currRes.value.data.weather)
            setAdvisory(currRes.value.data.irrigationAdvice)
            setImpacts(currRes.value.data.impactAnalysis || [])
          }
          if (foreRes.status === 'fulfilled') {
            setForecast(foreRes.value.data.forecast || [])
          }
        }
      } catch (err) {
        setError('Could not load weather data.')
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [])

  if (loading) return <div className="loading-page"><div className="spinner spinner-dark"></div><p>Fetching real-time weather...</p></div>

  if (!profile?.activeCrop) {
    return (
      <div style={{ background: '#F9FBF9', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🌾</div>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>No Active Crop Selected</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          To provide accurate weather-based irrigation advice, please select a crop first.
        </p>
        <button onClick={() => navigate('/farmer/crops')} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
          Select Crop Now →
        </button>
      </div>
    )
  }

  return (
    <div style={{ background: '#F9FBF9', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-dark)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <span>🌿</span> CropAdvisor
        </div>
        <div style={{ fontSize: '0.9rem' }}>{t('home')} ▾</div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Weather & Irrigation</h2>

        {/* Current Weather Card */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #4A90E2, #357ABD)', color: 'white', border: 'none', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 700 }}>{Math.round(weather?.temperature || 28)}°C</div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>{weather?.description || 'Loading...'} · {weather?.district}</div>
            </div>
            <div style={{ fontSize: '3rem' }}>
               {weather?.description?.includes('rain') ? '🌧️' : weather?.description?.includes('cloud') ? '⛅' : '☀️'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.75rem', borderRadius: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>💧 {weather?.humidity}%</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.75rem', borderRadius: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>🌧️ {weather?.rainfall || 0}mm</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.75rem', borderRadius: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>🌬️ {weather?.windSpeed}km/h</div>
            </div>
          </div>
        </div>

        {/* Forecast Row */}
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
          {forecast.map((item, i) => (
            <div key={i} style={{ 
              minWidth: 90, 
              background: i === 0 ? 'white' : 'transparent',
              border: i === 0 ? '1px solid #E3E8E3' : 'none',
              padding: '1rem 0.5rem', 
              borderRadius: '1rem', 
              textAlign: 'center',
              boxShadow: i === 0 ? 'var(--shadow-sm)' : 'none'
            }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                 {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {item.description.includes('rain') ? '🌧️' : item.description.includes('cloud') ? '⛅' : '☀️'}
              </div>
              <div style={{ fontWeight: 700 }}>{Math.round(item.temp)}°</div>
            </div>
          ))}
        </div>

        {/* Smart Irrigation Advisor */}
        <div className="glass-card" style={{ background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ color: '#4A90E2' }}>💧</span>
            <h3 style={{ fontSize: '1rem' }}>{t('guidance') || 'Smart Irrigation Advisor'}</h3>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <span>Soil Moisture: {weather?.humidity}% (Estimated)</span>
            </div>
            <div style={{ height: 8, background: '#F2F5F3', borderRadius: 4 }}>
              <div style={{ width: `${weather?.humidity}%`, height: '100%', background: weather?.humidity < 30 ? 'var(--danger)' : '#4CAF50', borderRadius: 4 }}></div>
            </div>
          </div>

          <div style={{ background: advisory?.includes('No irrigation') ? '#E8F5E9' : '#FFF8E1', border: advisory?.includes('No irrigation') ? '1px solid #C8E6C9' : '1px solid #FFE082', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ color: advisory?.includes('No irrigation') ? '#2E7D32' : '#F57F17' }}>
                {advisory?.includes('No irrigation') ? '✅' : '💧'}
              </span>
              <h4 style={{ color: advisory?.includes('No irrigation') ? '#1B5E20' : '#BF360C', fontSize: '0.95rem' }}>
                {advisory?.includes('No irrigation') ? 'Status: Adequate' : 'Action Required'}
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: advisory?.includes('No irrigation') ? '#2E7D32' : '#795548' }}>
              {advisory}
            </p>
          </div>

          {/* Impact Analysis */}
          {impacts.length > 0 && impacts[0] !== "Current weather is favorable for standard crop growth." && (
            <div style={{ marginTop: '1.5rem' }}>
               <h4 style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>⚠️ Weather Impact Alerts</h4>
               {impacts.map((impact, idx) => (
                 <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem 0', borderTop: '1px solid #F0F0F0' }}>
                   • {impact}
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Weather
