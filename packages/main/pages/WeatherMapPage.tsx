import React, { useEffect } from 'react';
import SimpleHeader from '../components/SimpleHeader';

const WeatherMapPage: React.FC = () => {
  
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
        // A real app would check event.origin for security
        console.log("Message received from weathermap iframe:", event.data);
    };

    window.addEventListener("message", handleMessage);

    return () => {
        window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <SimpleHeader logoSrc="/images/josoorlogo.png" logoAlt="Josoor" />
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <h1 className="text-5xl font-bold text-gray-900 text-center">Weather Map Visualization</h1>
            
            {/* Weather Map Section */}
            <div className="bg-white p-8 rounded shadow-md border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Capability Weather Map</h2>
                <p className="text-gray-600 mb-6">Interactive visualization of organizational capabilities and their current state.</p>
                <div className="w-full h-[70vh] rounded overflow-hidden border border-gray-300">
                    <iframe
                        src="http://localhost:5177"
                        title="weathermap"
                        className="w-full h-full"
                    />
                </div>
                 <div className="mt-6 bg-gray-50 p-6 rounded-md border">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Weather Map Features</h3>
                    <p className="text-gray-600">
                      This weather map provides real-time visualization of organizational capabilities, 
                      showing current states, trends, and transformation progress across different business areas.
                    </p>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMapPage;