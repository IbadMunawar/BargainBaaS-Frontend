import React, { useState, useEffect } from 'react'; // Added useEffect
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Save, Info, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { authFetch } from '../../services/api'; // Added authFetch import

const Configuration = () => {
  // Task: The form should be stateful (using useState).
  const [policyEndpoint, setPolicyEndpoint] = useState('');

  // ADDED: State to track the initially loaded value
  const [initialPolicyEndpoint, setInitialPolicyEndpoint] = useState('');
  
  // Placeholders for future integration (Day 5 logic)
  const [isLoading, setIsLoading] = useState(false); // isLoading is now used for GET too
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  // NEW CODE: useEffect hook to load the current configuration
  useEffect(() => {
    const loadConfiguration = async () => {
      setIsLoading(true);
      setError(null);
      setSaveSuccess(false); // Clear previous save success message

      try {
        const response = await authFetch('/configuration'); // Added leading slash for consistency
        
        // Backend returns client_policy_api_endpoint and client_api_key
        const data = await response.json(); // CHANGED: Awaited .json() from response

        if (data.client_policy_api_endpoint) {
          // Set both the display state and the initial state for comparison
          setPolicyEndpoint(data.client_policy_api_endpoint);
          setInitialPolicyEndpoint(data.client_policy_api_endpoint);
        }
      } catch (err) {
        console.error('Failed to load configuration:', err);
        // CHANGED: Safely handle 'unknown' error type
        const errorString = err instanceof Error ? err.message : 'Failed to load configuration. Please try logging in again.';
        setError(errorString);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfiguration();
  }, []); // Empty dependency array means this runs only once on mount

  // REPLACED LOGIC: Live form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Do nothing if the value hasn't changed
    if (policyEndpoint === initialPolicyEndpoint) {
      setSaveSuccess(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSaveSuccess(false);

    try {
      // Use authFetch for the authenticated POST request
      await authFetch('/configuration', 'POST', { // CHANGED: Added leading slash
        client_policy_api_endpoint: policyEndpoint,
      });
      
      // On successful save
      setInitialPolicyEndpoint(policyEndpoint); // Update the initial state
      setSaveSuccess(true);
    } catch (err) {
      console.error('Error saving configuration:', err);
      // CHANGED: Safely handle 'unknown' error type
      const errorString = err instanceof Error ? err.message : 'Failed to save configuration. Please ensure the URL is valid.';
      setError(errorString);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // We assume DashboardLayout is imported from '../../components/layout/DashboardLayout'
    <DashboardLayout pageTitle="Policy Engine Configuration">
      <div className="max-w-4xl mx-auto">
        
        {/* Helper Card / Explanation */}
        <div className="flex items-start p-4 mb-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <Info className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
          <div className="ml-3 text-sm text-blue-800">
            <h3 className="font-semibold text-blue-900">What is the Policy Endpoint?</h3>
            <p>
              This is the URL of your external pricing engine that BargainBaaS will call to get the minimum acceptable margin (MAM) and current asking price for a product. It allows our AI to negotiate within your defined profit boundaries.
            </p>
            <p className="mt-2 font-medium">
              Example format: <code className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded text-xs">https://your-domain.com/api/product-policy</code>
            </p>
          </div>
        </div>
        
        {/* Configuration Card with Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <LinkIcon className="h-5 w-5 mr-2 text-primary-600" />
            Client Policy Engine URL
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="policy-endpoint" className="block text-sm font-medium text-gray-700 mb-1">
                Your External Policy Engine API Endpoint URL
              </label>
              <input
                type="url"
                id="policy-endpoint"
                name="policy-endpoint"
                placeholder={isLoading ? "Loading configuration..." : "Enter your policy API URL here"} // Improved placeholder
                required
                value={policyEndpoint}
                onChange={(e) => {
                  setPolicyEndpoint(e.target.value);
                  // Clear messages when user starts typing again
                  setSaveSuccess(false);
                  setError(null);
                }}
                className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 shadow-sm transition duration-150 disabled:bg-gray-50 disabled:text-gray-500"
                disabled={isLoading}
              />
            </div>
            
            {/* Status Messages */}
            {saveSuccess && (
              <div className="p-3 mb-4 text-sm font-medium text-green-800 bg-green-100 rounded-lg" role="alert">
                Configuration saved successfully!
              </div>
            )}

            {error && (
              <div className="p-3 mb-4 text-sm font-medium text-red-800 bg-red-100 rounded-lg flex items-center" role="alert">
                 <AlertTriangle className="h-4 w-4 mr-2" />
                 {error}
              </div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm text-white transition duration-150 ${
                isLoading
                  ? 'bg-primary-400 cursor-not-allowed'
                  // Note: The original code used 'policyEndpoint === initialPolicyEndpoint' to disable, 
                  // but your provided code didn't include that, so I am matching your provided code.
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              {isLoading ? 'Processing...' : 'Save Configuration'} {/* Changed text to be more general */}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Configuration;