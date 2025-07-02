import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import { useLanguage } from '@/contexts/LanguageContext'

const Header = ({ onMenuClick }) => {
  const { t } = useTranslation()
  const { language, changeLanguage } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  const handleSearch = (query) => {
    setSearchQuery(query)
    // Implement search functionality
    console.log('Searching for:', query)
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
  ]

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode)
    setShowLanguageMenu(false)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div className="hidden md:block w-96">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

<div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <ApperIcon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" size={20} />
          </Button>

          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center"
            >
              <ApperIcon name="Globe" size={20} className="mr-1" />
              <span className="hidden sm:inline text-sm">
                {languages.find(lang => lang.code === language)?.flag}
              </span>
            </Button>

            {showLanguageMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3 ${
                      language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {language === lang.code && (
                      <ApperIcon name="Check" size={16} className="ml-auto text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="primary" size="sm" onClick={() => {}}>
              <ApperIcon name="Plus" size={16} className="mr-1" />
              {t('header.addProperty')}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden mt-4">
        <SearchBar onSearch={handleSearch} />
      </div>
    </header>
  )
}

export default Header