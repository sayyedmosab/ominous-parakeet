import React from 'react';
import SimpleHeader from '../../components/SimpleHeader';
import Frame from '../../components/Frame';

const JosoorExperienceAnalyticsPage: React.FC = () => {
  
  return (
    <div className="bg-gray-900 min-h-screen">
      <SimpleHeader logoSrc="/images/josoorlogo.png" logoAlt="Josoor" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <h1 className="text-5xl font-bold text-gray-900 text-center">eXperience: New Insights Analytics</h1>
            
            {/* "Analytics Gymnastics" Section */}
            <Frame layout="vertical" gap="8" justify="start" align="stretch" padding="8" width="full" bgColor="white" border="true" shadow="md" className="rounded">
                <div className="bg-white p-8 rounded shadow-md border border-gray-200">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Analytics Gymnastics: Interactive Heatmap Integration</h2>
                  <p className="text-gray-600">The AI-generated integration guide is temporarily disabled while we upgrade our services.</p>
                </div>
                <Frame layout="vertical" gap="4" justify="start" align="stretch" padding="0" width="full" bgColor="transparent" border="false" shadow="none">
                    <h3 className="text-2xl font-bold text-gray-800">Live Heatmap Demo</h3>
                    <p className="text-gray-600">Below is an embedded instance of the Heatmap Analytics component.</p>
                    <div className="w-full h-[70vh] rounded overflow-hidden border border-gray-300 bg-gray-50 flex items-center justify-center">
                        <iframe
                            src="https://example.com/my-component"
                            title="Heatmap Analytics"
                            className="w-full h-full"
                        />
                    </div>
                </Frame>
            </Frame>
        </div>
    </div>
  );
};

export default JosoorExperienceAnalyticsPage;
