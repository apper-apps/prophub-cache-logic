import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import PropertyCard from "@/components/molecules/PropertyCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Search from "@/components/pages/Search";
import { propertyService } from "@/services/api/propertyService";
import { clientService } from "@/services/api/clientService";

const Dashboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      const [propertiesData, clientsData] = await Promise.all([
        propertyService.getAll(),
        clientService.getAll()
      ])
      setProperties(propertiesData)
      setClients(clientsData)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const stats = {
    totalListings: properties.length,
    activeListings: properties.filter(p => p.status === 'Available').length,
    totalClients: clients.length,
    monthlyRevenue: properties
      .filter(p => p.status === 'Sold')
      .reduce((sum, p) => sum + p.price, 0) * 0.03 // 3% commission
  }

  const recentProperties = properties.slice(0, 4)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
<div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.title')}
          </h1>
          <p className="text-gray-600">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/search')}
            className="inline-flex items-center"
          >
            <ApperIcon name="Search" size={16} className="mr-2" />
            Advanced Search
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/add-property')}
            className="inline-flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<StatCard
          title={t('dashboard.stats.totalListings')}
          value={stats.totalListings}
          icon="Home"
          gradient="from-blue-500 to-blue-600"
        />
<StatCard
          title={t('dashboard.stats.activeListings')}
          value={stats.activeListings}
          icon="Eye"
          trend="up"
          trendValue="+5.2%"
          gradient="from-green-500 to-green-600"
        />
<StatCard
          title={t('dashboard.stats.totalClients')}
          value={stats.totalClients}
          icon="Users"
          trend="up"
          trendValue="+12.3%"
          gradient="from-purple-500 to-purple-600"
        />
<StatCard
          title={t('dashboard.stats.monthlyRevenue')}
          value={formatCurrency(stats.monthlyRevenue)}
          icon="DollarSign"
          trend="up"
          trendValue="+8.1%"
          gradient="from-amber-500 to-amber-600"
        />
      </div>

      {/* Quick Actions */}
<div className="bg-white rounded-lg p-6 shadow-card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('dashboard.quickActions')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="ghost"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => navigate('/add-property')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-2">
              <ApperIcon name="Plus" className="w-6 h-6 text-white" />
            </div>
<span className="text-sm font-medium">{t('dashboard.actions.addProperty')}</span>
          </Button>
          
          <Button
            variant="ghost"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => navigate('/clients')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-2">
              <ApperIcon name="UserPlus" className="w-6 h-6 text-white" />
            </div>
<span className="text-sm font-medium">{t('dashboard.actions.addClient')}</span>
          </Button>
          
          <Button
            variant="ghost"
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => navigate('/search')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-2">
              <ApperIcon name="Search" className="w-6 h-6 text-white" />
            </div>
<span className="text-sm font-medium">{t('dashboard.actions.propertySearch')}</span>
          </Button>
          
          <Button
            variant="ghost"
            className="flex flex-col items-center p-4 h-auto"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mb-2">
              <ApperIcon name="BarChart3" className="w-6 h-6 text-white" />
            </div>
<span className="text-sm font-medium">{t('dashboard.actions.viewReports')}</span>
          </Button>
        </div>
      </div>

      {/* Recent Properties */}
<div className="bg-white rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('dashboard.recentProperties')}
          </h2>
          <Button
            variant="ghost"
            onClick={() => navigate('/properties')}
            className="text-primary-600 hover:text-primary-700"
          >
            View All
            <ApperIcon name="ArrowRight" size={16} className="ml-1" />
          </Button>
        </div>
        
        {recentProperties.length === 0 ? (
<Empty
            title={t('dashboard.empty.noProperties')}
            description={t('dashboard.empty.noPropertiesDescription')}
            actionText={t('dashboard.actions.addProperty')}
            onAction={() => navigate('/add-property')}
            icon="Home"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProperties.map((property, index) => (
              <motion.div
                key={property.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

<div className="bg-white rounded-lg p-6 shadow-card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {t('dashboard.recentActivity')}
        </h2>
        <div className="space-y-4">
          {[
            {
              icon: 'Home',
              title: t('dashboard.activity.newPropertyListed'),
              description: t('dashboard.activity.newPropertyDescription'),
              time: '2 hours ago',
              color: 'from-blue-500 to-blue-600'
            },
            {
              icon: 'UserPlus',
              title: t('dashboard.activity.newClientInquiry'),
              description: t('dashboard.activity.newClientDescription'),
              time: '4 hours ago',
              color: 'from-green-500 to-green-600'
            },
            {
              icon: 'CheckCircle',
              title: t('dashboard.activity.propertySold'),
              description: t('dashboard.activity.propertySoldDescription'),
              time: '1 day ago',
              color: 'from-amber-500 to-amber-600'
            },
            {
              icon: 'Calendar',
              title: t('dashboard.activity.showingScheduled'),
              description: t('dashboard.activity.showingDescription'),
              time: '2 days ago',
              color: 'from-purple-500 to-purple-600'
            }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${activity.color} rounded-lg flex items-center justify-center mr-4`}>
                <ApperIcon name={activity.icon} className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard