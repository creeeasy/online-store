import { useState, useEffect } from "react";

export default function BotDetection() {
  const [activeBotScore, setActiveBotScore] = useState(false);
  const [botScore, setBotScore] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchBotDetectionData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call - replace with your actual API endpoint
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/botDetectionRoutes`);
        const data = await response.json();
        setActiveBotScore(data.data.activeBotScore || false);
        setBotScore(data.data.botScore?.toString() || "");
      } catch (error) {
        console.error('Failed to fetch bot detection data:', error);
        // Set default values on error
        setActiveBotScore(false);
        setBotScore("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBotDetectionData();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const payload = {
        activeBotScore,
        botScore: parseFloat(botScore) || 0
      };

      // Simulate API call - replace with your actual API endpoint
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/botDetectionRoutes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Bot detection settings updated successfully');
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Failed to update bot detection data:', error);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Bot Detection</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mt-16 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bot Detection</h2>
      
      {/* Success Message */}
      {updateSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Settings updated successfully!
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Active Bot Score Checkbox */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="activeBotScore"
            checked={activeBotScore}
            onChange={(e) => setActiveBotScore(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="activeBotScore" className="text-sm font-medium text-gray-700">
            Active Bot Score
          </label>
        </div>

        {/* Bot Score Input */}
        <div className="space-y-2">
          <label htmlFor="botScore" className="block text-sm font-medium text-gray-700">
            Bot Score
          </label>
          <input
            type="number"
            id="botScore"
            value={botScore}
            onChange={(e) => setBotScore(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter bot score"
            min="0"
            max="100"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Update Settings
        </button>
      </div>

      {/* Current Values Display */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Current Settings:</h3>
        <p className="text-sm text-gray-600">Active: {activeBotScore ? 'Yes' : 'No'}</p>
        <p className="text-sm text-gray-600">Score: {botScore || '0'}</p>
      </div>
    </div>
  );
}