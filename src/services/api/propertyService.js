import mockProperties from '@/services/mockData/properties.json'

class PropertyService {
  constructor() {
    this.properties = [...mockProperties]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

async getAll() {
    await this.delay()
    // Validate and sanitize image data to prevent canvas errors
    const validatedProperties = this.properties.map(property => ({
      ...property,
      images: this.validateImages(property.images || [])
    }))
    
    // Sort apartments by building, then floor, then apartment number for better organization
    return validatedProperties.sort((a, b) => {
      if (a.building && b.building) {
        if (a.building !== b.building) return a.building.localeCompare(b.building)
        if (a.floor !== b.floor) return a.floor - b.floor
        if (a.apartmentNumber && b.apartmentNumber) return a.apartmentNumber.localeCompare(b.apartmentNumber)
      }
      return a.Id - b.Id
    })
  }

async getById(id) {
    await this.delay()
    const property = this.properties.find(p => p.Id === id)
    if (!property) {
      throw new Error('Property not found')
    }
    return { 
      ...property,
      images: this.validateImages(property.images || [])
    }
  }

  validateImages(images) {
    if (!Array.isArray(images)) return []
    return images.filter(img => {
      if (!img || typeof img !== 'string') return false
      // Basic URL validation to prevent invalid sources
      try {
        new URL(img.startsWith('/') ? `https://example.com${img}` : img)
        return true
      } catch {
        return false
      }
    })
  }

  async create(propertyData) {
    await this.delay()
    const newProperty = {
      ...propertyData,
      Id: Math.max(...this.properties.map(p => p.Id)) + 1
    }
    this.properties.push(newProperty)
    return { ...newProperty }
  }

  async update(id, propertyData) {
    await this.delay()
    const index = this.properties.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Property not found')
    }
    this.properties[index] = { ...propertyData, Id: id, updatedAt: new Date().toISOString() }
    return { ...this.properties[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.properties.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Property not found')
    }
    this.properties.splice(index, 1)
    return true
  }
}

export const propertyService = new PropertyService()