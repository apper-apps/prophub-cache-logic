import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Properties from '@/components/pages/Properties'
import PropertyDetail from '@/components/pages/PropertyDetail'
import Clients from '@/components/pages/Clients'
import Search from '@/components/pages/Search'
import AddProperty from '@/components/pages/AddProperty'
import { LanguageProvider } from '@/contexts/LanguageContext'
import '@/i18n'
function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </Layout>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ zIndex: 9999 }}
          />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App