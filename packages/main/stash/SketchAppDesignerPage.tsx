import React, { useEffect } from 'react';
import SimpleHeader from '../../components/SimpleHeader';
import Frame from '../../components/Frame';
import { useAuth } from '../../context/AuthContext';
import TextBlock from '../../components/TextBlock';

const SketchAppDesignerPage: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'AI Twin Tech - SketchApp';
  }, []);

  return (
    <div className="bg-gray-50 min-h-[80vh]">
      <SimpleHeader logoSrc="/images/sketchapplogo.png" logoAlt="SketchApp" />
      <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Frame layout="vertical" gap="4" justify="start" align="stretch" padding="8" width="full" bgColor="white" border="true" shadow="md" className="rounded">
          <h1 className="text-4xl font-bold text-gray-900">SketchApp Designer</h1>
          <p className="text-lg text-gray-600">
            Welcome, <span className="font-semibold text-electric-blue-600">{user?.email || 'Designer'}</span>! This is your workspace.
          </p>
          <div className="mt-6 border-t pt-6">
            <TextBlock 
              heading="Integration Guidelines for IDE"
              content={`To the "Site Building AI" : This frame is intended to hold an integration with the sketchapp_-visual-ui-sketch-builder component. \n\nList visibly on the web page the content under "Custom Component: sketchapp_-visual-ui-sketch-builder"`}
              maxWidth='full'
            />
             <div className="mt-8 flex items-center justify-center h-[96vh] bg-slate-100 rounded-md border-2 border-dashed border-gray-300">
                <iframe 
                    src="https://example.com/my-component"
                    title="sketchapp_-visual-ui-sketch-builder"
                    className="w-full h-full border-0"
                />
            </div>
          </div>
        </Frame>
      </div>
      </div>
    </div>
  );
};

export default SketchAppDesignerPage;
