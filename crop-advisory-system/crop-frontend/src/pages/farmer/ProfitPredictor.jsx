import { useState, useEffect } from 'react'
import API from '../../utils/api'

const ProfitPredictor = () => {
  const [crops, setCrops] = useState([])
  const [selectedCrops, setSelectedCrops] = useState([])
  const [landSize, setLandSize] = useState('4.5')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    API.get('/crop/all')
      .then(res => setCrops(res.data.crops))
      .catch(err => console.error(err))
  }, [])

  const toggleCrop = (cropId) => {
    if (selectedCrops.includes(cropId)) {
      setSelectedCrops(selectedCrops.filter(id => id !== cropId))
    } else {
      setSelectedCrops([...selectedCrops, cropId])
    }
  }

  const handleSimulate = async () => {
    if (selectedCrops.length === 0 || !landSize) return
    setLoading(true)
    
    try {
      // Simulate API call for multiple crops
      const promises = selectedCrops.map(id => 
        API.post('/farm/predict-profit', { cropId: id, landSize: Number(landSize) })
      )
      const responses = await Promise.all(promises)
      
      // Calculate ROI and format results
      const formattedResults = responses.map(res => {
        const data = res.data
        const roi = ((data.expectedProfit / data.estimatedCost) * 100).toFixed(0)
        return {
          ...data,
          roi: Number(roi)
        }
      })

      // Rank by profit
      formattedResults.sort((a, b) => b.expectedProfit - a.expectedProfit)
      setResults(formattedResults)
    } catch (err) {
      console.error('Simulation failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#F9FBF9', minHeight: '100%', paddingBottom: '6rem' }}>
      <div style={{ padding: '1.5rem 1.5rem 0' }}>
        <h1 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '0.2rem' }}>What-If Simulation</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Compare crop profits on same land
        </p>

        {/* Form Card */}
        <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'white' }}>
          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--text-muted)' }}>LAND SIZE (ACRES)</label>
            <input 
              type="number" 
              className="input-field" 
              value={landSize}
              onChange={e => setLandSize(e.target.value)}
              style={{ background: '#F9FBF9', border: '1px solid #E3E8E3' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>SELECT CROPS</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {crops.map(c => {
                const isSelected = selectedCrops.includes(c._id)
                return (
                  <button
                    key={c._id}
                    onClick={() => toggleCrop(c._id)}
                    style={{
                      padding: '0.4rem 1rem',
                      borderRadius: '2rem',
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid #E3E8E3',
                      background: isSelected ? '#E8F5E9' : 'white',
                      color: isSelected ? 'var(--primary-dark)' : 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {c.name}
                  </button>
                )
              })}
            </div>
          </div>

          <button 
            onClick={handleSimulate}
            disabled={loading || selectedCrops.length === 0}
            style={{
              width: '100%', padding: '1rem', background: '#2D4F39', color: 'white',
              border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.95rem',
              cursor: selectedCrops.length === 0 ? 'not-allowed' : 'pointer',
              opacity: selectedCrops.length === 0 ? 0.7 : 1
            }}
          >
            {loading ? 'Calculating...' : `Run Simulation (${selectedCrops.length} crops)`}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="animate-up">
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600 }}>
              Results — Ranked by Profit
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {results.map((res, index) => {
                const isFirst = index === 0
                const isLoss = res.expectedProfit < 0
                const maxProfit = Math.max(...results.map(r => r.expectedProfit), 1)
                const barWidth = Math.max(10, Math.min(100, Math.abs(res.expectedProfit / maxProfit) * 100))
                
                return (
                  <div key={res.crop} style={{
                    background: 'white',
                    borderRadius: '1rem',
                    padding: '1.2rem',
                    border: isFirst ? '1.5px solid var(--primary)' : '1px solid #E3E8E3',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '0.5rem',
                          background: isFirst ? '#E8F5E9' : '#F0F4F8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, color: isFirst ? 'var(--primary)' : 'var(--text-muted)'
                        }}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{res.crop}</div>
                          {isFirst && <div style={{ fontSize: '0.7rem', background: '#E8F5E9', color: 'var(--primary)', padding: '0.1rem 0.5rem', borderRadius: '1rem', display: 'inline-block', marginTop: '0.2rem', fontWeight: 600 }}>Best Choice</div>}
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '1.2rem', fontWeight: 700, 
                          color: isLoss ? 'var(--danger)' : (isFirst ? 'var(--primary)' : 'var(--primary-dark)')
                        }}>
                          {isLoss ? '-' : '+'}₹{Math.abs(res.expectedProfit).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ROI: {res.roi}%
                        </div>
                      </div>
                    </div>

                    <div style={{ height: '6px', background: '#F0F4F8', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${barWidth}%`, 
                        background: isLoss ? 'var(--danger)' : (isFirst ? '#2D4F39' : '#1E3A8A'),
                        borderRadius: '3px'
                      }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfitPredictor
