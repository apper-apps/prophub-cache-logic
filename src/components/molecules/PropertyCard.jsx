import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate()

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

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/properties/${property.Id}`)}
    >
      <div className="relative overflow-hidden">
        {/* Image with hover effect */}
        <img
          src={property.images?.[0] || 'https://picsum.photos/400/250?random=1'}
          alt={property.title || 'Property image'}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://picsum.photos/400/250?random=1';
            console.warn('Failed to load property image:', property.images?.[0]);
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        
        <div className="absolute top-3 right-3">
          <Badge variant={getStatusVariant(property.status)}>
            {property.status}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-3 py-1 rounded-lg font-bold text-lg shadow-lg">
            {formatPrice(property.price)}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <ApperIcon name="MapPin" size={16} className="mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <ApperIcon name="Home" size={16} className="mr-1" />
              <span>{property.area} sqft</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Bed" size={16} className="mr-1" />
              <span>{property.bedrooms} bed</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Bath" size={16} className="mr-1" />
              <span>{property.bathrooms} bath</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/properties/${property.Id}`)
            }}
          >
            View Details
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              // Handle contact action
            }}
          >
            <ApperIcon name="Phone" size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default PropertyCard