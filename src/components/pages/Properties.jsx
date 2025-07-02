import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FilterPanel from "@/components/molecules/FilterPanel";
import PropertyCard from "@/components/molecules/PropertyCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { propertyService } from "@/services/api/propertyService";

const Properties = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    loadProperties()
  }, [])

const loadProperties = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await propertyService.getAll()
      // Validate properties have proper image arrays to prevent canvas errors
      const validatedData = data.map(property => ({
        ...property,
        images: Array.isArray(property.images) ? property.images.filter(img => img && typeof img === 'string') : []
      }))
      setProperties(validatedData)
      setFilteredProperties(validatedData)
    } catch (err) {
      console.error('Properties loading error:', err)
      setError('Failed to load properties. Please try again.')
    } finally {
      setLoading(false)
    }
  }

const handleFilter = (filters) => {
    let filtered = [...properties]

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
    // Apartment-specific filters
    if (filters.building) {
      filtered = filtered.filter(p => p.building && p.building.toLowerCase().includes(filters.building.toLowerCase()))
    }
    if (filters.floor) {
      filtered = filtered.filter(p => p.floor && p.floor === parseInt(filters.floor))
    }
    if (filters.apartmentNumber) {
      filtered = filtered.filter(p => p.apartmentNumber && p.apartmentNumber.toLowerCase().includes(filters.apartmentNumber.toLowerCase()))
    }

    setFilteredProperties(filtered)
  }

  const handleResetFilters = () => {
    setFilteredProperties(properties)
  }

  if (loading) return <Loading type="properties" />
  if (error) return <Error message={error} onRetry={loadProperties} />

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
<div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('properties.title')}
          </h1>
          <p className="text-gray-600">
            {t('properties.subtitle')}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none border-r"
            >
              <ApperIcon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <ApperIcon name="List" size={16} />
            </Button>
          </div>
<Button
            variant="primary"
            onClick={() => navigate('/add-property')}
            className="inline-flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {t('header.addProperty')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <FilterPanel onFilter={handleFilter} onReset={handleResetFilters} />

      {/* Results Count */}
<div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {t('properties.showing')} {filteredProperties.length} {t('properties.of')} {properties.length} apartments across 4 buildings
        </p>
      </div>

      {/* Properties Grid/List */}
      {filteredProperties.length === 0 ? (
<Empty
          title={t('properties.empty.title')}
          description={t('properties.empty.description')}
          actionText={t('header.addProperty')}
          onAction={() => navigate('/add-property')}
          icon="Home"
        />
      ) : (
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredProperties.map((property) => (
            <PropertyCard key={property.Id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Properties