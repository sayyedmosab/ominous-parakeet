import React from 'react';

const ArchitectLessonsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Architect Lessons</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive training modules for enterprise architects and transformation leaders.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            The Architect Lessons platform is currently under development. This section will provide
            in-depth training modules covering enterprise architecture, digital transformation,
            and strategic planning methodologies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Module 1</h3>
              <p className="text-sm text-gray-600">Enterprise Architecture Fundamentals</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Module 2</h3>
              <p className="text-sm text-gray-600">Digital Transformation Strategies</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Module 3</h3>
              <p className="text-sm text-gray-600">Implementation & Change Management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectLessonsPage;
