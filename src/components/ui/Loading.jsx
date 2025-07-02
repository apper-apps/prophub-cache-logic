import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'properties') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-card overflow-hidden"
          >
            <div className="h-48 bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4 animate-pulse" />
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2 animate-pulse" />
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-16 animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'dashboard') {
    return (
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-card"
            >
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2 mb-4 animate-pulse" />
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4 animate-pulse" />
            </motion.div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg p-6 shadow-card">
          <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/4 mb-6 animate-pulse" />
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full"
      />
    </div>
  )
}

export default Loading