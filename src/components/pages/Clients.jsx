import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { clientService } from "@/services/api/clientService";

const Clients = () => {
  const { t } = useTranslation()
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await clientService.getAll()
      setClients(data)
      setFilteredClients(data)
    } catch (err) {
      setError('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredClients(clients)
      return
    }

    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(query.toLowerCase()) ||
      client.email.toLowerCase().includes(query.toLowerCase()) ||
      client.phone.includes(query)
    )
    setFilteredClients(filtered)
  }

  const handleStatusUpdate = async (clientId, newStatus) => {
    try {
      const client = clients.find(c => c.Id === clientId)
      const updatedClient = await clientService.update(clientId, {
        ...client,
        status: newStatus
      })
      
      const updatedClients = clients.map(c => 
        c.Id === clientId ? updatedClient : c
      )
      setClients(updatedClients)
      setFilteredClients(updatedClients)
      toast.success(`Client status updated to ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update client status')
    }
  }

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success'
      case 'interested': return 'warning'
      case 'closed': return 'default'
      default: return 'default'
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadClients} />

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
<div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('clients.title')}
          </h1>
          <p className="text-gray-600">
            {t('clients.subtitle')}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            className="inline-flex items-center"
>
            <ApperIcon name="UserPlus" size={16} className="mr-2" />
            {t('clients.addClient')}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
<div className="bg-white rounded-lg p-6 shadow-card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <SearchBar 
              onSearch={handleSearch}
              placeholder={t('clients.searchPlaceholder')}
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {filteredClients.length} {t('clients.of')} {clients.length} {t('clients.clientsText')}
            </span>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      {filteredClients.length === 0 ? (
<Empty
          title={t('clients.empty.title')}
          description={t('clients.empty.description')}
          actionText={t('clients.addClient')}
          onAction={() => {}}
          icon="Users"
        />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('clients.table.client')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('clients.table.contact')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('clients.table.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('clients.table.interestedProperties')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('clients.table.added')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('clients.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client, index) => (
                  <motion.tr
                    key={client.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(client.status)}>
                        {client.status}
                      </Badge>
                    </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.interestedProperties?.length || 0} {t('clients.properties')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Phone" size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Mail" size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="MoreHorizontal" size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clients