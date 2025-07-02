import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { propertyService } from "@/services/api/propertyService";

const AddProperty = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    location: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    status: 'Available'
  })

  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.type) newErrors.type = 'Property type is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.area || parseFloat(formData.area) <= 0) newErrors.area = 'Valid area is required'
    if (!formData.bedrooms || parseInt(formData.bedrooms) < 0) newErrors.bedrooms = 'Valid bedroom count is required'
    if (!formData.bathrooms || parseFloat(formData.bathrooms) < 0) newErrors.bathrooms = 'Valid bathroom count is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        images: [
          '/api/placeholder/800/600',
          '/api/placeholder/800/600',
          '/api/placeholder/800/600'
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await propertyService.create(propertyData)
      toast.success('Property added successfully!')
      navigate('/properties')
    } catch (err) {
      toast.error('Failed to add property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t("addProperty.title")}
            </h1>
            <p className="text-gray-600">
                {t("addProperty.subtitle")}
            </p>
        </div>
        <Button
            variant="ghost"
            onClick={() => navigate("/properties")}
            className="inline-flex items-center">
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            {t("addProperty.backToProperties")}
        </Button>
    </div>
    <motion.div
        initial={{
            opacity: 0,
            y: 20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        className="bg-white rounded-lg shadow-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("addProperty.basicInformation")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label={t("addProperty.labels.propertyTitle")}
                        value={formData.title}
                        onChange={e => handleChange("title", e.target.value)}
                        error={errors.title}
                        placeholder={t("addProperty.placeholders.title")} />
                    <Select
                        label={t("addProperty.labels.propertyType")}
                        value={formData.type}
                        onChange={e => handleChange("type", e.target.value)}
                        error={errors.type}>
                        <option value="">{t("addProperty.placeholders.selectType")}</option>
                        <option value="House">{t("addProperty.types.house")}</option>
                        <option value="Apartment">{t("addProperty.types.apartment")}</option>
                        <option value="Condo">{t("addProperty.types.condo")}</option>
                        <option value="Townhouse">{t("addProperty.types.townhouse")}</option>
                        <option value="Commercial">{t("addProperty.types.commercial")}</option>
                    </Select>
                    <Input
                        label={t("addProperty.labels.price")}
                        type="number"
                        value={formData.price}
                        onChange={e => handleChange("price", e.target.value)}
                        error={errors.price}
                        placeholder={t("addProperty.placeholders.price")} />
                    <Input
                        label={t("addProperty.labels.location")}
                        value={formData.location}
                        onChange={e => handleChange("location", e.target.value)}
                        error={errors.location}
                        placeholder={t("addProperty.placeholders.location")} />
                </div>
            </div>
            {/* Property Details */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("addProperty.propertyDetails")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                        label={t("addProperty.labels.area")}
                        type="number"
                        value={formData.area}
                        onChange={e => handleChange("area", e.target.value)}
                        error={errors.area}
                        placeholder={t("addProperty.placeholders.area")} />
                    <Input
                        label={t("addProperty.labels.bedrooms")}
                        type="number"
                        value={formData.bedrooms}
                        onChange={e => handleChange("bedrooms", e.target.value)}
                        error={errors.bedrooms}
                        placeholder={t("addProperty.placeholders.bedrooms")} />
                    <Input
                        label={t("addProperty.labels.bathrooms")}
                        type="number"
                        step="0.5"
                        value={formData.bathrooms}
                        onChange={e => handleChange("bathrooms", e.target.value)}
                        error={errors.bathrooms}
                        placeholder={t("addProperty.placeholders.bathrooms")} />
                </div>
            </div>
            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("addProperty.description")}
                </label>
                <textarea
                    rows={6}
                    className={`
                w-full px-3 py-2 border rounded-lg shadow-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                transition-colors duration-200
                ${errors.description ? "border-red-300 bg-red-50" : "border-gray-300 bg-white hover:border-gray-400"}
              `}
                    value={formData.description}
                    onChange={e => handleChange("description", e.target.value)}
                    placeholder={t("addProperty.placeholders.description")} />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
            </div>
            {/* Status */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("addProperty.listingStatus")}
                </h2>
                <Select
                    label={t("addProperty.labels.status")}
                    value={formData.status}
                    onChange={e => handleChange("status", e.target.value)}>
                    <option value="Available">{t("addProperty.statuses.available")}</option>
                    <option value="Pending">{t("addProperty.statuses.pending")}</option>
                    <option value="Sold">{t("addProperty.statuses.sold")}</option>
                </Select>
            </div>
            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/properties")}
                    disabled={loading}
                    disabled={loading}>
                    {t("addProperty.cancel")}
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="inline-flex items-center">
                        {loading ? <>
                            <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                            {t("addProperty.addingProperty")}
                        </> : <>
                            <ApperIcon name="Plus" size={16} className="mr-2" />
                            {t("header.addProperty")}
                        </>}
                    </Button>
                </Button></div>
        </form>
    </motion.div>
</div>
  )
}

export default AddProperty