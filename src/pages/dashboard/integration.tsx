import React, { useState, useEffect } from 'react'; // ADDED useEffect
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Key, Copy, Check, AlertTriangle, Zap } from 'lucide-react';
import { authFetch } from '../../services/api'; // ADDED authFetch

const Integration = () => {
  // REPLACED mock data with live state
  const [apiKey, setApiKey] = useState('Loading API Key...'); // Initial message while loading
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // NEW CODE: useEffect hook to load the API Key
  useEffect(() => {
    const loadApiKey = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use the same GET endpoint as the Configuration page
        const response = await authFetch('configuration');
        const data = response.data;

        if (data.client_api_key) {
          setApiKey(data.client_api_key);
        } else {
          // Should not happen if API is built correctly, but good for safety
          setApiKey('API Key Not Found');
        }
      } catch (err) {
        console.error('Failed to load API Key:', err);
        setError(err.message || 'Failed to connect to the API server.');
        setApiKey('ERROR LOADING KEY');
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKey();
  }, []); // Runs only once on mount

  // Implement the "Copy to Clipboard" logic
  const handleCopy = () => {
    // navigator.clipboard.writeText is the standard, modern way.
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(apiKey).then(() => {
        setIsCopied(true);
        // Reset the checkmark after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers or restricted environments (like iframes)
        fallbackCopyTextToClipboard(apiKey);
      });
    } else {
      // Fallback
      fallbackCopyTextToClipboard(apiKey);
    }
  };
  
  // Fallback function for copying text using document.execCommand
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
      } else {
          console.error('Fallback: Copying text command failed');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  };


  return (
    <DashboardLayout pageTitle="API Integration & Keys">
      <div className="max-w-4xl mx-auto">

        {/* NEW CODE: Error Status Message */}
        {error && (
          <div className="p-4 mb-6 text-sm font-medium text-red-800 bg-red-100 border border-red-200 rounded-lg flex items-center" role="alert">
             <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
             {error}
          </div>
        )}
        {/* End Error Status Message */}

        {/* API Key Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Key className="h-5 w-5 mr-2 text-primary-600" />
            Your Tenant API Key
          </h2>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={apiKey} // NOW USES LIVE STATE
              className="flex-grow px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-l-lg font-mono text-sm shadow-inner select-all overflow-hidden whitespace-nowrap overflow-ellipsis"
              aria-label="Tenant API Key"
              disabled={isLoading || !!error} // UPDATED: Disable when loading or error
            />
            <button
              onClick={handleCopy}
              disabled={isLoading || !!error || apiKey.startsWith('Loading') || apiKey.includes('ERROR') || apiKey.includes('Not Found')} // UPDATED: Disable logic
              className={`flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-lg shadow-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isCopied 
                  ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500' 
                  : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'
              } disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {isCopied ? <Check className="h-5 w-5 mr-1" /> : <Copy className="h-5 w-5 mr-1" />}
              {isCopied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          
          <p className="mt-4 text-sm text-gray-600">
            Use this key to authorize all server-to-server calls to your external Policy Engine (the URL you configured on the Configuration page).
          </p>
        </div>
        
        {/* Quickstart/Setup Guide Card */}
         <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
          <Zap className="h-5 w-5 mt-0.5 text-yellow-600 flex-shrink-0" />
          <div className="ml-3 text-sm text-yellow-800">
            <h3 className="font-semibold text-yellow-900">Next Steps: Setup</h3>
            <p>
              Before deploying, ensure your external Policy Engine is configured to accept requests from BargainBaaS and validates this API key in the <code>Authorization: Bearer [KEY]</code> header.
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Integration;