import React, { useEffect } from 'react';
import SimpleHeader from '../../components/SimpleHeader';
import { useAuth } from '../../context/AuthContext';

const AuraProjectManagerPage: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'AI Twin Tech - Aura';
  }, []);

  return (
    <div className="bg-gray-50 min-h-[70vh]">
      <SimpleHeader logoSrc="/images/auralogonotext.png" logoAlt="Aura" />
      <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded shadow-md border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900">Aura Project Manager</h1>
          <p className="text-lg text-gray-600 mt-2">
            Welcome, <span className="font-semibold text-electric-blue-600">{user?.email || 'Manager'}</span>. Let's get those AIs in line.
          </p>
          <div className="mt-8 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-800">Project Dashboard</h2>
            <p className="text-gray-500 mt-2">Oversee all AI-driven projects, track changes, and manage deployments from this central hub.</p>
            <div className="mt-8 flex items-center justify-center h-96 bg-slate-100 rounded-md border-2 border-dashed border-gray-300">
                <p className="text-gray-400 font-medium">Project Management Interface Goes Here</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AuraProjectManagerPage;
