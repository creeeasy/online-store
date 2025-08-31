import React from 'react';
import { useAppSelector } from '../hooks/redux';

const GlobalLoadingOverlay: React.FC = () => {
  const { isLoading, loadingMessage } = useAppSelector((state) => state.loading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-red-50 to-white flex items-center justify-center z-50 p-4">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-200 rounded-full animate-pulse opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main loading card */}
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-2xl max-w-md w-full border border-red-100 transform hover:scale-105 transition-transform duration-300">
        
        {/* Decorative corner elements */}
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-red-300 rounded-tr-lg"></div>
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-red-300 rounded-bl-lg"></div>

        {/* Animated loading rings */}
        <div className="flex items-center justify-center mb-8 relative">
          <div className="relative w-20 h-20">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-red-100 animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 animate-spin" style={{ animationDuration: '1s' }}></div>
            
            {/* Middle pulsing ring */}
            <div className="absolute inset-2 rounded-full border-2 border-red-200 animate-pulse"></div>
            
            {/* Inner counter-rotating ring */}
            <div className="absolute inset-4 rounded-full border-2 border-transparent border-b-red-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            
            {/* Center dot */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-r from-red-400 to-red-500 animate-pulse shadow-lg"></div>
          </div>
        </div>

        {/* Content with typing animation */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-red-600 bg-clip-text text-transparent">
            {loadingMessage || 'Loading...'}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed animate-pulse">
            Creating something amazing for you
          </p>
        </div>

        {/* Animated progress waves */}
        <div className="mt-8 relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-red-400 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent rounded-full animate-ping opacity-30"></div>
          
          {/* Wave effect */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transform -translate-x-full animate-pulse"
              style={{ 
                animation: 'wave 2s ease-in-out infinite',
              }}
            ></div>
          </div>
        </div>

        {/* Floating dots around the card */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-300 rounded-full animate-ping opacity-40"></div>
        <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse opacity-50"></div>
      </div>

      <style>{`
        @keyframes wave {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default GlobalLoadingOverlay;