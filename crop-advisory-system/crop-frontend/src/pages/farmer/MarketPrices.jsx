import { useState, useEffect } from 'react'
import API from '../../utils/api'

const MarketPrices = () => {
  const [all, setAll]       = useState([])
  const [activeCropData, setActiveCropData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const [allRes, activeRes] = await Promise.allSettled([
          API.get('/market/all-crops'),
          API.get('/market/prices')
        ])
        if (allRes.status === 'fulfilled') setAll(allRes.value.data.prices || [])
        if (activeRes.status === 'fulfilled') setActiveCropData(activeRes.value.data)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <div className="loading-page"><div className="spinner spinner-dark"></div><p>Loading market insights...</p></div>

  const filtered = all.filter(p => p.cropName.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div style={{ background: '#F9FBF9', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-dark)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <span>🌿</span> CropAdvisor
        </div>
        <div style={{ fontSize: '0.9rem' }}>தமிழ் ▾</div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Market Intelligence</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Live mandi prices · AI-powered selling advice</p>

        {/* AI Selling Intelligence */}
        {activeCropData && (
          <div className="premium-header" style={{ borderRadius: '1.5rem', marginBottom: '1.5rem', padding: '1.5rem', background: 'linear-gradient(135deg, #2c3e50, #000)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>AI Selling Insight</div>
              <div style={{ background: activeCropData.aiSuggestion.decision === 'Sell Now' ? 'var(--success)' : 'var(--warning)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>
                {activeCropData.aiSuggestion.decision.toUpperCase()}
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>For your {activeCropData.cropName} crop</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.4', marginBottom: '1rem' }}>
              {activeCropData.aiSuggestion.reason}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.65rem', opacity: 0.6, textTransform: 'uppercase' }}>Current Avg. Price</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>₹{activeCropData.todayPrice?.modalPrice || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', opacity: 0.6, textTransform: 'uppercase' }}>Demand Level</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>{activeCropData.demandLevel}</div>
              </div>
            </div>
          </div>
        )}

        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>All Market Prices</h3>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search crop..." 
            className="input-field" 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Price Cards */}
        {filtered.length > 0 ? (
          filtered.map((p, i) => (
            <div key={p._id || i} className="glass-card" style={{ background: 'white', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{p.cropName}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>📍</span> {p.mandiName}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{p.modalPrice}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>per quintal</div>
                  <div style={{ fontSize: '0.75rem', color: i % 2 === 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                    {i % 2 === 0 ? '▲ +18%' : '▼ -5%'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', borderTop: '1px solid #F2F5F3', paddingTop: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Min</div>
                  <div style={{ fontWeight: 600 }}>₹{p.minPrice}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Modal</div>
                  <div style={{ fontWeight: 600 }}>₹{p.modalPrice}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max</div>
                  <div style={{ fontWeight: 600 }}>₹{p.maxPrice}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <p>No prices found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketPrices
