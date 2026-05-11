import { useState, useEffect } from 'react'
import API from '../../utils/api'

const ManageCrops = () => {
  const [crops, setCrops]     = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  const fetchCrops = () => {
    API.get('/crop/all')
      .then(res => setCrops(res.data.crops || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCrops() }, [])

  const deleteCrop = async (id, name) => {
    if (!confirm(`Delete ${name}?`)) return
    await API.delete(`/crop/${id}`)
    setSuccess(`${name} deleted`)
    fetchCrops()
    setTimeout(() => setSuccess(''), 3000)
  }

  if (loading) return <div className="loading-page"><div className="spinner spinner-dark"></div></div>

  return (
    <div>
      <div className="page-header">
        <h2>🌾 Manage Crops</h2>
        <p>View and manage the crop database ({crops.length} crops)</p>
      </div>

      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Crop</th><th>Season</th><th>Soil Types</th><th>Water Need</th><th>Duration</th><th></th></tr>
            </thead>
            <tbody>
              {crops.map(c => (
                <tr key={c._id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.season?.join(', ')}</td>
                  <td style={{ fontSize:'0.8rem', color:'#616161' }}>{c.soilTypes?.join(', ')}</td>
                  <td><span className={`badge ${
                    c.waterNeed==='High' ? 'badge-red' :
                    c.waterNeed==='Medium' ? 'badge-yellow' : 'badge-green'}`}>
                    {c.waterNeed}
                  </span></td>
                  <td>{c.growingDurationDays} days</td>
                  <td>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => deleteCrop(c._id, c.name)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageCrops
