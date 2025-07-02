import { motion } from 'framer-motion'

const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full"
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    available: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
    pending: "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200",
    sold: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  }

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.span>
  )
}

export default Badge