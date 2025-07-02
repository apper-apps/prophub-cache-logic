import mockClients from '@/services/mockData/clients.json'

class ClientService {
  constructor() {
    this.clients = [...mockClients]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.clients]
  }

  async getById(id) {
    await this.delay()
    const client = this.clients.find(c => c.Id === id)
    if (!client) {
      throw new Error('Client not found')
    }
    return { ...client }
  }

  async create(clientData) {
    await this.delay()
    const newClient = {
      ...clientData,
      Id: Math.max(...this.clients.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString()
    }
    this.clients.push(newClient)
    return { ...newClient }
  }

  async update(id, clientData) {
    await this.delay()
    const index = this.clients.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Client not found')
    }
    this.clients[index] = { ...clientData, Id: id }
    return { ...this.clients[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.clients.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Client not found')
    }
    this.clients.splice(index, 1)
    return true
  }
}

export const clientService = new ClientService()