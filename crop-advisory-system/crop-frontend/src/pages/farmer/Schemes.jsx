import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/api'
import { useLang } from '../../context/LanguageContext'

const Schemes = () => {
  const { t } = useLang()
  const navigate = useNavigate()
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/schemes')
        setSchemes(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <div className="loading-page"><div className="spinner spinner-dark"></div><p>Checking eligibility...</p></div>

  return (
    <div style={{ background: '#F9FBF9', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', background: 'var(--primary-dark)', color: 'white', gap: '1rem' }}>
        <span onClick={() => navigate(-1)} style={{ fontSize: '1.2rem', cursor: 'pointer' }}>←</span>
        <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{t('schemes') || 'Government Schemes'}</h2>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Showing eligible subsidies and schemes based on your location and crop.
        </p>

        {schemes.length > 0 ? (
          schemes.map((s, i) => (
            <div key={s._id || i} className="glass-card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.2rem 0.5rem', borderRadius: '0.4rem', fontSize: '0.65rem', fontWeight: 700 }}>
                  {s.category.toUpperCase()}
                </div>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{s.description}</p>
              
              <div style={{ background: '#F5F7F6', padding: '0.75rem', borderRadius: '0.75rem', fontSize: '0.8rem' }}>
                <strong>Benefits:</strong> {s.benefits}
              </div>
              
              {s.link && (
                <a href={s.link} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: '1rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
                  Apply Online →
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state" style={{ padding: '3rem 1.5rem' }}>
             <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
             <p style={{ fontWeight: 600 }}>No specific schemes found</p>
             <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Try updating your farm profile to check more accurately.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Schemes
