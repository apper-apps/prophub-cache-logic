import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import PropertyCard from '@/components/molecules/PropertyCard'
import FilterPanel from '@/components/molecules/FilterPanel'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { propertyService } from '@/services/api/propertyService'

const Search = () => {
  const { t } = useTranslation()
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    loadProperties()
  }, [])

  useEffect(() => {
    handleSearch()
  }, [searchQuery, properties, sortBy])

  const loadProperties = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await propertyService.getAll()
      setProperties(data)
      setFilteredProperties(data)
    } catch (err) {
      setError('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    let filtered = [...properties]

    // Text search
    if (searchQuery.trim()) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort results
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'area-large':
        filtered.sort((a, b) => b.area - a.area)
        break
      case 'area-small':
        filtered.sort((a, b) => a.area - b.area)
        break
      default:
        break
    }

    setFilteredProperties(filtered)
  }

  const handleFilter = (filters) => {
    let filtered = [...properties]

    // Apply text search first
    if (searchQuery.trim()) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply filters
    if (filters.type) {
      filtered = filtered.filter(p => p.type.toLowerCase().includes(filters.type.toLowerCase()))
    }
    if (filters.status) {
      filtered = filtered.filter(p => p.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice))
    }
    if (filters.bedrooms) {
      filtered = filtered.filter(p => p.bedrooms >= parseInt(filters.bedrooms))
    }
    if (filters.location) {
      filtered = filtered.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'area-large':
        filtered.sort((a, b) => b.area - a.area)
        break
      case 'area-small':
        filtered.sort((a, b) => a.area - b.area)
        break
      default:
        break
    }

    setFilteredProperties(filtered)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSortBy('newest')
    setFilteredProperties(properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  }

  if (loading) return <Loading type="properties" />
  if (error) return <Error message={error} onRetry={loadProperties} />

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
<div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('search.title')}
        </h1>
        <p className="text-gray-600">
          {t('search.subtitle')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg p-6 shadow-card mb-6">
        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
<Input
              label={t('search.placeholders.searchProperties')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.placeholders.searchDescription')}
            />
          </div>
          <div className="md:w-48">
<label className="block text-sm font-medium text-gray-700 mb-2">
              {t('search.sortBy')}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
>
              <option value="newest">{t('search.sorting.newest')}</option>
              <option value="oldest">{t('search.sorting.oldest')}</option>
              <option value="price-low">{t('search.sorting.priceLowHigh')}</option>
              <option value="price-high">{t('search.sorting.priceHighLow')}</option>
              <option value="area-large">{t('search.sorting.areaLargeSmall')}</option>
              <option value="area-small">{t('search.sorting.areaSmallLarge')}</option>
            </select>
          </div>
          <Button
            variant="primary"
            onClick={handleSearch}
            className="md:w-auto w-full"
          >
<ApperIcon name="Search" size={16} className="mr-2" />
            {t('search.search')}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <FilterPanel onFilter={handleFilter} onReset={handleResetFilters} />

      {/* Search Results */}
      <div className="bg-white rounded-lg p-6 shadow-card mb-6">
<div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('search.searchResults')}
          </h2>
<span className="text-gray-600">
            {filteredProperties.length} {t('properties.of')} {properties.length} {t('properties.propertiesText')}
          </span>
        </div>
      </div>

      {/* Results Grid */}
      {filteredProperties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
<Empty
            title={t('search.empty.title')}
            description={t('search.empty.description')}
            actionText={t('search.empty.resetSearch')}
            onAction={handleResetFilters}
            icon="Search"
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default Search