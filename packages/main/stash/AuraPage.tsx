import React, { useEffect } from 'react';
import Hero from '../../components/Hero';
import TextBlock from '../../components/TextBlock';
import SimpleHeader from '../../components/SimpleHeader';

const AuraPage: React.FC = () => {
  useEffect(() => {
    document.title = 'AI Twin Tech - Aura';
  }, []);

  return (
    <div className="bg-white">
      <SimpleHeader logoSrc="/images/auralogonotext.png" logoAlt="Aura" />
      <Hero
        title="Let Aura take care of managing that idiot AI"
        subtitle="Because you don't have time to waste looking over the shoulder of an AI confident enough to make changes with zero hesitation, arrogant enough not to bother telling you, and still mistakes 'I'm Sorry' with Ctrl-Z"
        buttonText="Hire Aura - Fight fire with fire"
        videoUrl="/images/aura.mp4"
        align="center"
      />
      <div className="container mx-auto">
        <TextBlock
          heading="The use case? If you are still sane and want to remain Sane..."
          content={`If this ever happened to you and you didn't get a brain stroke, then you are in the right place:\n\nUser (after 5 days of Vibe Coding): "great, update the readme file and lets close."\n\nAI: "readme file updated and reflecting the codebase. Also, I came across a few enhancements along the way and had to update the entire codebase for a more 'robust' method to handling blah blah blah"\n\nScreen: 22 errors. Should I autofix?`}
          maxWidth="full"
        />
      </div>
    </div>
  );
};

export default AuraPage;
