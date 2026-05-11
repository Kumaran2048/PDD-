import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'

// Auth Pages
import Login    from './pages/Login'
import Register from './pages/Register'

// Farmer Pages
import FarmerDashboard  from './pages/farmer/Dashboard'
import CropAdvisor      from './pages/farmer/CropAdvisor'
import DiseaseScanner   from './pages/farmer/DiseaseScanner'
import Weather          from './pages/farmer/Weather'
import MarketPrices     from './pages/farmer/MarketPrices'
import ExpenseTracker   from './pages/farmer/ExpenseTracker'
import ProfitPredictor  from './pages/farmer/ProfitPredictor'
import Profile          from './components/Profile'
import Schemes          from './pages/farmer/Schemes'
import SeasonalPlanning  from './pages/farmer/SeasonalPlanning'
import { LanguageProvider } from './context/LanguageContext'

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard'
import FarmerList       from './pages/officer/FarmerList'
import DiseaseAlerts    from './pages/officer/DiseaseAlerts'

// Admin Pages
import AdminDashboard   from './pages/admin/AdminDashboard'
import ManageCrops      from './pages/admin/ManageCrops'
import ManageUsers      from './pages/admin/ManageUsers'
import ManagePrices     from './pages/admin/ManagePrices'

// Layout wrapper
const AppLayout = ({ children }) => {
  const { user } = useAuth()

  return (
    <div className="app-container">
      <main className="main-content fade-in">
        {children}
      </main>
      {user && <BottomNav />}
    </div>
  )
}

// Root redirect based on role
const RootRedirect = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={`/${user.role}`} replace />
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login"    element={<div className="app-container"><Login /></div>} />
            <Route path="/register" element={<div className="app-container"><Register /></div>} />
            <Route path="/"         element={<RootRedirect />} />

            {/* Protected Routes */}
            <Route path="/farmer" element={<ProtectedRoute allowedRoles={['farmer']}><AppLayout><FarmerDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/farmer/crops" element={<ProtectedRoute allowedRoles={['farmer']}><AppLayout><CropAdvisor /></AppLayout></ProtectedRoute>} />
            <Route path="/farmer/disease" element={<ProtectedRoute allowedRoles={['farmer']}><AppLayout><DiseaseScanner /></AppLayout></ProtectedRoute>} />
            <Route path="/farmer/weather" element={<ProtectedRoute allowedRoles={['farmer']}><AppLayout><Weather /></AppLayout></ProtectedRoute>} />
            <Route path="/farmer/market" element={<ProtectedRoute allowedRoles={['farmer']}><AppLayout><MarketPrices /></AppLayout></ProtectedRoute>} />
            <Route path="/farmer/expenses" element={<ProtectedRoute allowedRoles={['farmer']}><AppLayout><ExpenseTracker /></AppLayout></ProtectedRoute>} />
            <Route path="/farmer/profit" element={<ProtectedRoute allowedRoles={['farmer']}><AppLayout><ProfitPredictor /></AppLayout></ProtectedRoute>} />
            <Route path="/farmer/profile" element={<ProtectedRoute allowedRoles={['farmer']}><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
            <Route path="/farmer/schemes" element={<ProtectedRoute allowedRoles={['farmer']}><AppLayout><Schemes /></AppLayout></ProtectedRoute>} />
            <Route path="/farmer/planning" element={<ProtectedRoute allowedRoles={['farmer']}><AppLayout><SeasonalPlanning /></AppLayout></ProtectedRoute>} />

            <Route path="/officer" element={<ProtectedRoute allowedRoles={['officer']}><AppLayout><OfficerDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/officer/farmers" element={<ProtectedRoute allowedRoles={['officer']}><AppLayout><FarmerList /></AppLayout></ProtectedRoute>} />
            <Route path="/officer/diseases" element={<ProtectedRoute allowedRoles={['officer']}><AppLayout><DiseaseAlerts /></AppLayout></ProtectedRoute>} />
            <Route path="/officer/profile" element={<ProtectedRoute allowedRoles={['officer']}><AppLayout><Profile /></AppLayout></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/crops" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><ManageCrops /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><ManageUsers /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/prices" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><ManagePrices /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
