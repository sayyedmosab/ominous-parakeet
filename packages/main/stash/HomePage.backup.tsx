import React, { useEffect } from 'react';
import Frame from '../components/Frame';
import Hero from '../components/Hero';
import TextBlock from '../components/TextBlock';
import SimpleHeader from '../components/SimpleHeader';
import { visionBackgroundImage } from '../assets/imageData';
import { PenTool, Wand2, ArrowRight, Sparkles, Users, Zap } from 'lucide-react';

const ImageTextSection: React.FC<{
  heading: string | React.ReactNode;
  content: string;
  buttonText: string;
  imageUrl: string;
  imagePosition: 'left' | 'right';
}> = ({ heading, content, buttonText, imageUrl, imagePosition }) => {
  const imageOrder = imagePosition === 'left' ? 'md:order-1' : 'md:order-2';
  const textOrder = imagePosition === 'left' ? 'md:order-2' : 'md:order-1';

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className={`flex flex-col justify-center ${textOrder}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{heading}</h2>
          <p className="text-gray-600 leading-relaxed mb-6">{content}</p>
          <a href="#/josoor" className="w-auto self-start px-6 py-3 bg-electric-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-electric-blue-700 transition-all duration-300">
            {buttonText}
          </a>
        </div>
        <div className={`${imageOrder} flex flex-col`}>
          <img src={imageUrl} alt={typeof heading === 'string' ? heading : 'Product image'} className="rounded-lg shadow-xl w-[70%] h-auto object-cover mx-auto mb-[-4px]" />
        </div>
      </div>
    </div>
  );
};


const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'AI Twin Tech';
  }, []);

  const products = [
    {
      id: 1,
      title: "SketchApp - Vibe Designer",
      description: "The simple and intuitive solution to finally make Vibe Coding work: SketchApp helps you rapidly Vibe Design your idea into specifications AI understands. Drop the outputs (a perfect prompt or React pages) into any AI Site Builder prompt or Coding Agent from the first time, 100% guaranteed, even when using the worst model out there.",
      icon: PenTool,
      status: "Available",
      href: "/sketchapp"
    },
    {
      id: 2,
      title: "Aura - Vibe Manager - Soon",
      description: "Whether specs are ready from SketchApp or you want to type them or even dictate them, Aura is your empowered multi-skilled IT PMO to get your product done as agreed: BA details and fine tunes your requirements including the more technically complex items. Once you approve, it produces the coding plan blueprint and takes over with the coding agent till done",
      icon: Wand2,
      status: "Coming Soon",
      href: "/aura"
    }
  ];

  return (
    <div className="bg-white">
            <SimpleHeader logoSrc="/images/aittlogo.png" logoAlt="AI Twin Tech" />
            <Frame layout="vertical" gap="0" justify="start" align="stretch" padding="0" isSticky="false" width="full" bgColor="slate-100" border="true" shadow="sm">
        <Hero 
            title="Welcome to AI Twin Tech"
            subtitle="Our Mission: In a world of complexities, we focus on innovating simplicity in whole domains, topics, and what lays between them."
            videoUrl="/images/3129576-uhd_2560_1440_30fps.mp4"
            align="center"
        />
        <div className='bg-slate-100'>
            <TextBlock
                heading="Products Portfolio"
                content="This is the jump pad to navigate to our various products. Each link will take you to a separate site and product. Keep checking in for the latest."
                maxWidth="full"
            />
        </div>
      </Frame>
      
      <Frame layout="horizontal" gap="0" justify="start" align="stretch" padding="1" isSticky="false" width="full" bgColor="white" border="true" shadow="sm" className="h-[450px] px-1 py-0">
        <div className="container mx-auto py-0 px-4 flex flex-row justify-center items-center">
          <div className="flex gap-6 flex-row justify-center items-center">
            <div className="flex flex-col justify-center order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                <strong>Josoor </strong>
                <span>
                  <sup style={{ position: 'relative', top: '-11.25px' }}>
                    <span style={{ fontSize: '18.5px', color: 'rgb(208, 2, 27)', fontWeight: '700' }}>
                      (New)
                    </span>
                  </sup>
                </span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                <p style={{ whiteSpaceCollapse: 'preserve' }}></p>
                <span style={{ fontSize: '21px' }}>
                  <span style={{ fontSize: '35px' }}>
                    <span style={{ fontSize: '56px' }}>
                      <span style={{ fontSize: '61px' }}>
                        <span style={{ fontSize: '63px' }}>
                          <span style={{ fontSize: '22px' }}>
                            <span style={{ fontSize: '67px' }}>
                              <span style={{ fontSize: '66px' }}>
                                <span style={{ fontSize: '66px' }}>
                                  <span>
                                    <span style={{ fontSize: '24px' }}>
                                      <span>
                                        <span style={{ fontSize: '24px' }}>
                                          <span>
                                            <b>
                                              <p style={{ whiteSpaceCollapse: 'preserve' }}>
                                                <span style={{ fontSize: '20px' }}>
                                                  Our flagship product, transforming strategy execution in government organizations through a comprehensive Digital Twin
                                                </span>
                                              </p>
                                              <p style={{ whiteSpaceCollapse: 'preserve' }}></p>
                                              <p style={{ whiteSpaceCollapse: 'preserve' }}></p>
                                            </b>
                                          </span>
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
                <p style={{ whiteSpaceCollapse: 'preserve' }}>
                  Josoor, meaning 'bridges' in Arabic, embodies the core idea of bridging strategy to execution. As the design evolved, it became clear that a single bridge isn't enough—multiple Josoor are essential, varying in scale, purpose, and complexity. These bridges form the heart of our platform, enabling a dynamic digital twin that mirrors and optimizes your organization's operations.
                </p>
              </p>
              <a href="#/josoor" className="w-auto self-start px-6 py-3 bg-electric-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-electric-blue-700 transition-all duration-300">
                Learn More
              </a>
            </div>
            <div className="flex flex-col font-light order-2 justify-center leading-[10px]">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                <div className="flex flex-col leading-normal w-full ml-0 max-md:w-full max-md:ml-0">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fdcb6338cd56942dd9d0d7f3bbd865659%2Fda7626f191304239852921d874541180"
                    alt="Product image"
                    className="rounded-lg shadow-xl w-auto h-auto object-cover mx-auto my-[77px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Frame>
      
      <Frame layout="horizontal" gap="0" justify="start" align="stretch" padding="0" isSticky="false" width="full" bgColor="white" border="true" shadow="sm">
        <div className="container mx-auto py-0 px-4 flex flex-row justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map(card => {
              const IconComponent = card.icon;
              return (
                <div key={card.id} className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 flex flex-col hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-electric-blue-100 rounded-lg">
                      <IconComponent className="w-8 h-8 text-electric-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{card.title}</h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        card.status === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {card.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed flex-grow mb-6">{card.description}</p>
                  <a 
                    href={`#${card.href}`}
                    className="flex items-center gap-2 text-electric-blue-600 hover:text-electric-blue-700 font-semibold transition-colors duration-200"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </Frame>
    </div>
  );
};

export default HomePage;
