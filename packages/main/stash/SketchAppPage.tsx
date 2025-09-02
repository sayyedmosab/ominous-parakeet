import React, { useEffect } from 'react';
import Hero from '../../components/Hero';
import Frame from '../../components/Frame';
import TextBlock from '../../components/TextBlock';
import SimpleHeader from '../../components/SimpleHeader';

const SketchAppPage: React.FC = () => {
  useEffect(() => {
    document.title = 'AI Twin Tech - SketchApp';
  }, []);

  return (
    <div>
      <SimpleHeader logoSrc="/images/sketchapplogo.png" logoAlt="SketchApp" />
      <Hero
        title="Old Schoolers line up here"
        subtitle="Not the best, Not the Greatest, we're just right."
        buttonText="Get Started"
        videoUrl="/images/sketchapp.mp4"
        align="center"
      />
      <Frame layout="horizontal" gap="0" justify="center" align="stretch" padding="0" isSticky="false" width="full" bgColor="transparent" border="true" shadow="none">
        <div className="container mx-auto py-16 px-4">
            <TextBlock 
                heading="Rapidly reflect your site into computer language"
                content={`If you are anything like me, I just could not get over the need to right long prompts to describe a site structure thats is basic and easier to explain in a tree. Too much typing gets to my fingers. So back to the old ways of drag and drop. SketchApp has all the basic components to create the striucture and rough out each page. \n\nAnd then as I went on, it did end up havign a few "advanced" features if thats what you want to call them. Anyhow, this is a free tool, a gift to my generation still kicking it!\n\nJust register so I know who is who... and you can play around all you want. Enjoy`}
                maxWidth="full"
            />
        </div>
      </Frame>
    </div>
  );
};

export default SketchAppPage;
