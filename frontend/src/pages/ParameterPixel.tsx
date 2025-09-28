import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFacebook, FiCheck, FiAlertCircle, FiSave, FiRefreshCw, FiEye, FiShoppingCart, FiUserPlus, FiKey } from 'react-icons/fi';
import { getAuthToken } from '../utils/apiClient';

export default function ParameterPixel() {
  const [pixelData, setPixelData] = useState({
    facebookPixel: false,
    apiConversion: false,
    pixelId: '',
    accessToken: '',
    eventTypes: {
      PageView: true,
      Purchase: false,
      Lead: false,
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Event type icons mapping
  const eventIcons = {
    PageView: <FiEye className="text-blue-600" />,
    Purchase: <FiShoppingCart className="text-green-600" />,
    Lead: <FiUserPlus className="text-purple-600" />
  };

  // Fetch existing pixel parameters on component mount
  useEffect(() => {
    const fetchPixelParameters = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/pixel-parameters`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch pixel parameters');
        }

        if (data.data) {
          setPixelData({
            facebookPixel: data.data.facebookPixel || false,
            apiConversion: data.data.apiConversion || false,
            pixelId: data.data.pixelId || '',
            accessToken: data.data.accessToken || '',
            eventTypes: data.data.eventTypes || {
              PageView: true,
              Purchase: false,
              Lead: false,
            }
          });
          setIsEditing(true);
        }
      } catch (error) {
        
        setErrorMessage(error.message || 'An error occurred while loading');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPixelParameters();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name in pixelData.eventTypes) {
      setPixelData(prev => ({
        ...prev,
        eventTypes: {
          ...prev.eventTypes,
          [name]: checked
        }
      }));
    } else if (name === 'facebookPixel' || name === 'apiConversion') {
      setPixelData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setPixelData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if ((pixelData.facebookPixel || pixelData.apiConversion) && !pixelData.pixelId.trim()) {
      newErrors.pixelId = 'Pixel ID is required when Facebook Pixel or API Conversion is enabled';
    } else if ((pixelData.facebookPixel || pixelData.apiConversion) && !/^\d+$/.test(pixelData.pixelId)) {
      newErrors.pixelId = 'Pixel ID must contain only numbers';
    }
    
    if (pixelData.apiConversion && !pixelData.accessToken.trim()) {
      newErrors.accessToken = 'Access Token is required when API Conversion is enabled';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const token = getAuthToken();
      const method = isEditing ? 'PUT' : 'POST';
      const endpoint = isEditing 
        ? `${import.meta.env.VITE_APP_API_URL}/pixel-parameters` 
        : `${import.meta.env.VITE_APP_API_URL}/pixel-parameters`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          facebookPixel: pixelData.facebookPixel,
          apiConversion: pixelData.apiConversion,
          pixelId: pixelData.pixelId,
          accessToken: pixelData.accessToken,
          eventTypes: pixelData.eventTypes
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'save'} pixel parameters`);
      }

      if (data.success) {
        setIsSubmitted(true);
        setIsEditing(true);
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'saving'} pixel parameters:`, error);
      setErrorMessage(error.message || `An error occurred while ${isEditing ? 'updating' : 'saving'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto pt-16"
    >
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <FiFacebook className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Facebook Pixel Configuration
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Configure your Facebook Pixel to track user interactions and optimize your marketing campaigns with precise data.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiFacebook className="mr-3 text-blue-600" />
            {isEditing ? 'Update Pixel Configuration' : 'Create Pixel Configuration'}
          </h2>
        </div>

        <div className="p-6">
          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center"
              >
                <FiCheck className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-800 font-medium">
                  Pixel configuration {isEditing ? 'updated' : 'saved'} successfully!
                </span>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-center"
              >
                <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-red-800">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 p-5 rounded-xl border border-gray-200"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Select Services to Enable
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Facebook Pixel Checkbox */}
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    pixelData.facebookPixel
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="facebookPixel"
                    checked={pixelData.facebookPixel}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center w-6 h-6 rounded border mr-3 ${
                    pixelData.facebookPixel 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-white border-gray-300'
                  }`}>
                    {pixelData.facebookPixel && <FiCheck className="w-4 h-4" />}
                  </div>
                  <div className="flex items-center">
                    <FiFacebook className="mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Facebook Pixel
                    </span>
                  </div>
                </motion.label>

                {/* API Conversion Checkbox */}
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    pixelData.apiConversion
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="apiConversion"
                    checked={pixelData.apiConversion}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center w-6 h-6 rounded border mr-3 ${
                    pixelData.apiConversion 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-white border-gray-300'
                  }`}>
                    {pixelData.apiConversion && <FiCheck className="w-4 h-4" />}
                  </div>
                  <div className="flex items-center">
                    <FiKey className="mr-2 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">
                      API Conversion
                    </span>
                  </div>
                </motion.label>
              </div>
            </motion.div>

            {/* Pixel ID Input - Only shown when Facebook Pixel or API Conversion is selected */}
            {(pixelData.facebookPixel || pixelData.apiConversion) && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 p-5 rounded-xl border border-gray-200"
              >
                <label htmlFor="pixelId" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs mr-2">Required</span>
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  id="pixelId"
                  name="pixelId"
                  value={pixelData.pixelId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.pixelId 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  } focus:ring-2 focus:ring-opacity-20 transition-all duration-200 bg-white`}
                  placeholder="Enter your Pixel ID (e.g., 1234567890)"
                />
                {errors.pixelId && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600 flex items-center"
                  >
                    <FiAlertCircle className="mr-1" /> {errors.pixelId}
                  </motion.p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Find your Pixel ID in your Facebook Events Manager under Settings → Pixel ID
                </p>
              </motion.div>
            )}

            {/* Access Token Input - Only shown when API Conversion is selected */}
            {pixelData.apiConversion && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 p-5 rounded-xl border border-gray-200"
              >
                <label htmlFor="accessToken" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs mr-2">Required</span>
                  Access Token
                </label>
                <input
                  type="text"
                  id="accessToken"
                  name="accessToken"
                  value={pixelData.accessToken}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.accessToken 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  } focus:ring-2 focus:ring-opacity-20 transition-all duration-200 bg-white`}
                  placeholder="Enter your Access Token"
                />
                {errors.accessToken && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600 flex items-center"
                  >
                    <FiAlertCircle className="mr-1" /> {errors.accessToken}
                  </motion.p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Generate an access token with the required permissions in your Facebook Business Settings
                </p>
              </motion.div>
            )}

            {/* Event Types Selection - Only shown when at least one service is selected */}
            {(pixelData.facebookPixel || pixelData.apiConversion) && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-50 p-5 rounded-xl border border-gray-200"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Track These Events
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(pixelData.eventTypes).map(([event, isChecked]) => (
                    <motion.label
                      key={event}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isChecked
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`event-${event}`}
                        name={event}
                        checked={isChecked}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`flex items-center justify-center w-6 h-6 rounded border mr-3 ${
                        isChecked 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'bg-white border-gray-300'
                      }`}>
                        {isChecked && <FiCheck className="w-4 h-4" />}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">{eventIcons[event]}</span>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {event.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    </motion.label>
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Select which events you want to track. PageView is recommended for all websites.
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-4"
            >
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 flex items-center justify-center ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2 w-5 h-5" />
                    {isEditing ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2 w-5 h-5" />
                    {isEditing ? 'Update Configuration' : 'Save Configuration'}
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <FiAlertCircle className="mr-2 text-indigo-600" />
          Why Configure Facebook Pixel?
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Track conversions and optimize ads</li>
          <li>• Build targeted audiences for future ads</li>
          <li>• Analyze customer journey and behavior</li>
          <li>• Measure cross-device conversions</li>
        </ul>
      </motion.div>

      {/* Background decorative elements */}
      <div className="fixed -right-32 top-32 w-80 h-80 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-30 blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed -left-32 bottom-32 w-64 h-64 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-full opacity-20 blur-3xl pointer-events-none -z-10"></div>
    </motion.div>
  );
}