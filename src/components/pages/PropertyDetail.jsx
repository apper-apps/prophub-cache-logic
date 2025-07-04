import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Properties from "@/components/pages/Properties";
import clientsData from "@/services/mockData/clients.json";
import propertiesData from "@/services/mockData/properties.json";
import { propertyService } from "@/services/api/propertyService";

const PropertyDetail = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (id) {
      loadProperty()
    }
  }, [id])

  const loadProperty = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await propertyService.getById(parseInt(id))
      setProperty(data)
    } catch (err) {
      setError('Property not found')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      const updatedProperty = await propertyService.update(property.Id, {
        ...property,
        status: newStatus
      })
      setProperty(updatedProperty)
      toast.success(`Property status updated to ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update property status')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return 'available'
      case 'pending': return 'pending'
      case 'sold': return 'sold'
      default: return 'default'
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={() => navigate('/properties')} />
  if (!property) return <Error message="Property not found" />

return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/properties')}
          className="inline-flex items-center"
        >
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          {t('propertyDetail.backToProperties')}
        </Button>
        <div className="flex items-center space-x-3">
          <Badge variant={getStatusVariant(property.status)}>
            {property.status}
          </Badge>
          <Button variant="secondary" size="sm">
            <ApperIcon name="Edit" size={16} className="mr-1" />
            {t('propertyDetail.edit')}
          </Button>
          <Button variant="primary" size="sm">
            <ApperIcon name="Share" size={16} className="mr-1" />
            {t('propertyDetail.share')}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gray-100 rounded-lg overflow-hidden"
          >
            {/* Main Image */}
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={property.images?.[currentImageIndex] || 'https://picsum.photos/800/600?random=1'}
                alt={property.title || 'Property image'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://picsum.photos/800/600?random=1';
                  console.warn('Failed to load property image:', property.images?.[currentImageIndex]);
                }}
                onLoad={(e) => {
                  e.target.style.opacity = '1';
                }}
                style={{ opacity: '0', transition: 'opacity 0.3s' }}
              />
            </div>
            
            {/* Navigation Arrows */}
            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  disabled={currentImageIndex === 0}
                >
                  <ApperIcon name="ChevronLeft" size={20} />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(Math.min(property.images.length - 1, currentImageIndex + 1))}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  disabled={currentImageIndex === property.images.length - 1}
                >
                  <ApperIcon name="ChevronRight" size={20} />
                </button>
              </>
            )}
          </motion.div>
          
          {/* Thumbnail Gallery */}
          {property.images && property.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image || 'https://picsum.photos/80/80?random=1'}
                    alt={`${property.title || 'Property'} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://picsum.photos/80/80?random=1';
                      console.warn('Failed to load thumbnail:', image);
                    }}
                    onLoad={(e) => {
                      e.target.style.opacity = '1';
                    }}
                    style={{ opacity: '0', transition: 'opacity 0.2s' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {property.title}
              </h1>
              <div className="text-3xl font-bold text-primary-600">
                {formatPrice(property.price)}
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 mb-4">
              <ApperIcon name="MapPin" size={20} className="mr-2" />
              <span className="text-lg">{property.location}</span>
            </div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-600">
              <div className="flex items-center">
                <ApperIcon name="Home" size={20} className="mr-2" />
                <span>{property.area} {t('propertyDetail.units.sqft')}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Bed" size={20} className="mr-2" />
                <span>{property.bedrooms} {t('propertyDetail.units.bedrooms')}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Bath" size={20} className="mr-2" />
                <span>{property.bathrooms} {t('propertyDetail.units.bathrooms')}</span>
              </div>
              {property.building && (
                <div className="flex items-center">
                  <ApperIcon name="Building" size={20} className="mr-2" />
                  <span>{property.building}</span>
                </div>
              )}
              {property.floor && (
                <div className="flex items-center">
                  <ApperIcon name="Layers" size={20} className="mr-2" />
                  <span>Floor {property.floor}</span>
                </div>
              )}
              {property.apartmentNumber && (
                <div className="flex items-center">
                  <ApperIcon name="Hash" size={20} className="mr-2" />
                  <span>Unit {property.apartmentNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
<div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('propertyDetail.description')}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>

{/* Property Features */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('propertyDetail.propertyFeatures')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <ApperIcon name="Home" size={16} className="mr-2 text-gray-500" />
                <span className="text-sm text-gray-700">{property.type}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Calendar" size={16} className="mr-2 text-gray-500" />
                <span className="text-sm text-gray-700">{t('propertyDetail.features.listed')} {new Date(property.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="TrendingUp" size={16} className="mr-2 text-gray-500" />
                <span className="text-sm text-gray-700">{t('propertyDetail.features.marketReady')}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Shield" size={16} className="mr-2 text-gray-500" />
                <span className="text-sm text-gray-700">{t('propertyDetail.features.verifiedListing')}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex space-x-3">
              <Button
                variant="primary"
                className="flex-1 inline-flex items-center justify-center"
>
                <ApperIcon name="Phone" size={16} className="mr-2" />
                {t('propertyDetail.contactClient')}
              </Button>
              <Button
                variant="secondary"
                className="flex-1 inline-flex items-center justify-center"
>
                <ApperIcon name="Calendar" size={16} className="mr-2" />
                {t('propertyDetail.scheduleShowing')}
              </Button>
            </div>

{/* Status Update */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{t('propertyDetail.updateStatus')}</h4>
              <div className="flex space-x-2">
                {['Available', 'Pending', 'Sold'].map((status) => (
                  <Button
                    key={status}
                    variant={property.status === status ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handleStatusUpdate(status)}
                    disabled={property.status === status}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail