
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import image1 from '../assets/1.png'
import image2 from '../assets/2.png'
import image3 from '../assets/3.png'
import image4 from '../assets/4.png'
import image5 from '../assets/5.png'
import image6 from '../assets/6.png'
import { getAuthToken } from "../utils/apiClient";
// import { getToken } from "../utils/auth";

export default function IntegrateSheet() {
  const [sheetId, setSheetId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchData = async () => {
    try {
      const token=getAuthToken()
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/sheets`,{
        method:"GET",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setSheetId(result?.sheetID)
      
    } catch (err) {
      setSheetId("")
    } 
  };
  useEffect(()=>{
    fetchData();
  },[])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
        const token=getAuthToken()
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/sheets`, {
        method: 'PUT',
        headers: { 
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
        body: JSON.stringify({ sheetId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect Google Sheet');
      }
      
      const data = await response.json();
      setIsSubmitted(true);
      // You might want to store the sheet ID in state or context for later use
    } catch (err) {
      setError(err.message || 'An error occurred while connecting to Google Sheets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const images = [
    { src: image1, title: "Enter share", description: "Enter share in sheet that you have create" },
    { src: image2, title: "General Access", description: "Choose 'Anyone with the link" },
    { src: image3, title: "Editor type", description: "Select Editor" },
    { src: image4, title: "Change name sheet", description: "Change name to Store" },
    { src: image5, title: "Rename it to Store", description: "Rename it to Store" },
    { src: image6, title: "Find Your Sheet ID", description: "Copy the Sheet ID from your Google Sheets URL" }
  ];

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute -top-10 right-0 text-white text-3xl hover:text-indigo-300 transition-colors"
              >
                &times;
              </button>
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title}
                className="max-w-full max-h-screen object-contain rounded-lg"
              />
              <div className="text-white text-center mt-4">
                <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                <p>{selectedImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Google Sheets Integration</h1>
        <p className="text-gray-600">
          Connect your store data directly to Google Sheets for advanced analysis and reporting.
        </p>
      </motion.div>

      <div className="flex grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white py-6 p-3 rounded-xl shadow-md border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Setup Instructions</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="sheetId" className="block text-sm font-medium text-gray-700 mb-1">
                Google Sheet ID
              </label>
              <input
                type="text"
                id="sheetId"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                placeholder="e.g., 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Found in your Google Sheet URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
              </p>
            </div>
            
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Connecting..." : "Connect Sheet"}
                {!isLoading && (
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
              </motion.button>
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </form>

          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Success! Your Google Sheet has been connected. Data will sync automatically .
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Integration Benefits</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-gray-600">Automatic order data synchronization</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-gray-600">Real-time inventory updates</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-gray-600">Custom reporting and analytics</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-gray-600">Customer data management</p>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Image Explanations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12"
      >
   <motion.h2 
  className="text-3xl font-bold bg-gradient-to-r  bg-clip-text text-black mb-12 text-center drop-shadow-lg p-1 "
  animate={{ 
    y: [0, 0, 0], // Elegant floating motion
    scale: [1.04, 1.06, 1.04], // Gentle breathing effect
    textShadow: [
      "0 4px 8px rgba(59, 130, 246, 0.3)",
      "0 8px 16px rgba(147, 51, 234, 0.4)", 
      "0 4px 8px rgba(59, 130, 246, 0.3)"
    ]
  }}
  transition={{ 
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  style={{
    filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
  }}
>
  ✨ Connect Your Google Sheets in 6 Simple Steps ✨
</motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div 
              key={index}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-100 cursor-pointer"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              onClick={() => handleImageClick(image)}
            >
              <div className="h-40 bg-gray-100 rounded-md mb-4 overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{image.title}</h3>
              <p className="text-sm text-gray-600">{image.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}