import React from 'react';
import { Calendar, Users, Target, Rocket } from 'lucide-react';

const RoadmapPage: React.FC = () => {
  const phases = [
    {
      title: "Phase 1: Crowd Sourcing Design Ideas",
      description: "Weekly episode (document, interactive audio podcast, drops on concepts and components of the new transformation elements",
      duration: "Estimated 1-2 months",
      outcome: "Ends with the Publishing of the Design along with credits manifest of all contributors",
      status: "upcoming",
      icon: Users
    },
    {
      title: "Phase 2: Crowd Sourcing MVP Dev Priorities",
      description: "Bi-Weekly product drops - 2 x database model - 2 x backend systems integration - 2 x front end interfaces",
      duration: "Ongoing development",
      outcome: "MVP components ready for integration",
      status: "current",
      icon: Target
    },
    {
      title: "Phase 3: The Official Launch of v0",
      description: "Official launch of the complete transformation platform",
      duration: "Post-MVP completion",
      outcome: "Full platform available to users",
      status: "future",
      icon: Rocket
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'future': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Transformation Roadmap</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow our journey as we build the future of enterprise transformation together
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-blue-200 transform -translate-x-1/2"></div>
          
          <div className="space-y-12">
            {phases.map((phase, index) => {
              const IconComponent = phase.icon;
              return (
                <div key={index} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 w-6 h-6 rounded-full border-4 border-white ${
                    phase.status === 'current' ? 'bg-green-500' :
                    phase.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-400'
                  } transform -translate-x-1/2 z-10`}></div>
                  
                  <div className="ml-16 bg-white rounded-lg shadow-lg p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {IconComponent && <IconComponent className="w-6 h-6 text-blue-600" />}
                        <h2 className="text-2xl font-semibold text-gray-900">{phase.title}</h2>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(phase.status)}`}>
                        {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{phase.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{phase.duration}</span>
                      </div>
                      <div className="md:col-span-2">
                        <strong className="text-gray-900">Outcome:</strong> {phase.outcome}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Join Our Journey</h3>
            <p className="text-gray-600 mb-4">
              Be part of this transformative experience. Your ideas and feedback shape the future of enterprise transformation.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Involved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;