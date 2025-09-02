import React from 'react';
import Frame from '../../components/Frame';
import TextBlock from '../../components/TextBlock';
import SimpleHeader from '../../components/SimpleHeader';

const JourneyStep: React.FC<{ number: number; title: string; description: string; isLast?: boolean }> = ({ number, title, description, isLast=false }) => (
  <div className="relative pl-12">
    {!isLast && <div className="absolute left-5 top-5 bottom-[-2rem] w-0.5 bg-electric-blue-300"></div>}
    <div className="absolute left-0 top-1.5 flex items-center justify-center w-10 h-10 rounded-full bg-electric-blue-600 text-white font-bold text-lg shadow-md">
      {number}
    </div>
    <div className="ml-4">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  </div>
);

const JosoorExecutePage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <SimpleHeader logoSrc="/images/josoorlogo.png" logoAlt="Josoor" />
      <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <Frame layout="vertical" gap="12" justify="center" align="stretch" padding="4" width="full" bgColor="transparent" border="false" shadow="none">
          <div className='text-center'>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">eXecute: In 90 days to UC001</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From concept to reality. Our structured roadmap demystifies digital twin implementation.
            </p>
          </div>
          
          <Frame layout="vertical" width="full" bgColor="gray-50" border="true" shadow="md" className="p-8 rounded-lg">
            <TextBlock heading="Our DTO building approach" content="We believe in an iterative, value-driven approach to building a Digital Twin of an Organization. Start small, deliver value quickly, and scale with confidence." maxWidth='prose'/>
            <TextBlock heading="The iterative framework" content={`Building a full-scale DTO is a significant undertaking. Instead of a multi-year, high-risk "big bang" project, we advocate for a phased approach that delivers tangible results at every stage. Our framework focuses on building a series of interconnected "mini-twins" that target specific business domains.\n\nThis methodology reduces risk, accelerates time-to-value, and allows the organization to learn and adapt as the DTO evolves. Each mini-twin builds upon the last, gradually creating a comprehensive, enterprise-wide digital twin.`} maxWidth='full'/>
          </Frame>

          <Frame layout="vertical" width="full" bgColor="white" border="true" shadow="md" className="p-8 rounded-lg">
             <div className='text-center mb-10'>
                 <h2 className="text-3xl font-bold text-gray-900">The 90-Day Journey to UC001</h2>
                 <p className="text-md text-gray-600 max-w-2xl mx-auto mt-2">Go from concept to a functional, value-generating mini-twin in just one quarter.</p>
             </div>
            <div className="max-w-4xl mx-auto w-full">
                <div className="space-y-12">
                <JourneyStep
                    number={1}
                    title="Phase 1: Discovery & Scoping (Days 1-30)"
                    description="We work with your team to identify the most valuable use case (UC001), define success metrics, and map out the required data sources and system integrations."
                />
                <JourneyStep
                    number={2}
                    title="Phase 2: Foundation & Integration (Days 31-60)"
                    description="Our team builds the core data pipelines, configures the ontology for UC001, and develops the initial user interface. The digital twin begins to take shape."
                />
                <JourneyStep
                    number={3}
                    title="Phase 3: Activation & Handover (Days 61-90)"
                    description="We launch UC001 for a pilot group, gather feedback, and refine the system. The journey concludes with comprehensive training and handover to your team."
                    isLast={true}
                />
                </div>
            </div>
          </Frame>
        </Frame>
      </div>
      </div>
    </div>
  );
};

export default JosoorExecutePage;
