import { useState, useEffect } from 'react'
import API from '../../utils/api'

const ManagePrices = () => {
  const [prices, setPrices]   = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding]   = useState(false)
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    cropName:'', district:'', state:'', mandiName:'',
    minPrice:'', maxPrice:'', modalPrice:''
  })

  const fetchPrices = () => {
    API.get('/market/all-crops')
      .then(res => setPrices(res.data.prices || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPrices() }, [])

  const addPrice = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      await API.post('/market/prices', form)
      setSuccess('Market price added!')
      setForm({ cropName:'', district:'', state:'', mandiName:'', minPrice:'', maxPrice:'', modalPrice:'' })
      fetchPrices()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add price')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>💰 Manage Market Prices</h2>
        <p>Add today's crop prices from mandi data</p>
      </div>

      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="grid-2" style={{ alignItems:'start' }}>
        <div className="card">
          <div className="card-title">➕ Add Market Price</div>
          <form onSubmit={addPrice}>
            {[
              ['cropName',   'Crop Name',   'e.g. Tomato'],
              ['district',   'District',    'e.g. Coimbatore'],
              ['state',      'State',       'e.g. Tamil Nadu'],
              ['mandiName',  'Mandi Name',  'e.g. Ukkadam Market'],
              ['minPrice',   'Min Price ₹', 'Per quintal'],
              ['maxPrice',   'Max Price ₹', 'Per quintal'],
              ['modalPrice', 'Modal Price ₹','Most common price'],
            ].map(([name, label, placeholder]) => (
              <div className="form-group" key={name}>
                <label className="form-label">{label}</label>
                <input className="form-input"
                  type={name.includes('Price') ? 'number' : 'text'}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={e => setForm({...form, [name]: e.target.value})}
                  required />
              </div>
            ))}
            <button className="btn btn-primary btn-full" disabled={adding}>
              {adding ? <><span className="spinner"></span> Adding...</> : '➕ Add Price'}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-title">📋 Today's Prices</div>
          {loading ? (
            <div className="loading-page"><div className="spinner spinner-dark"></div></div>
          ) : prices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💰</div>
              <p>No prices added yet for today</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Crop</th><th>Mandi</th><th>Modal ₹</th></tr></thead>
                <tbody>
                  {prices.map(p => (
                    <tr key={p._id}>
                      <td><strong>{p.cropName}</strong></td>
                      <td style={{ fontSize:'0.82rem', color:'#616161' }}>{p.mandiName}</td>
                      <td style={{ color:'var(--green-mid)', fontWeight:700 }}>₹{p.modalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManagePrices
