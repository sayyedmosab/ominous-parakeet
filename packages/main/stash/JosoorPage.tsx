import React, { useEffect } from 'react';
import Frame from '../../components/Frame';
import Hero from '../../components/Hero';
import TextBlock from '../../components/TextBlock';
import SimpleHeader from '../../components/SimpleHeader';
import { 
  Search, 
  Building2, 
  Database, 
  Eye, 
  MessageCircle, 
  BarChart3, 
  Play, 
  BookOpen, 
  Target,
  Compass,
  Network,
  Brain,
  TrendingUp
} from 'lucide-react';

const JosoorPage: React.FC = () => {
  useEffect(() => {
    document.title = 'AI Twin Tech - Josoor';
  }, []);

  return (
    <div className="bg-white">
        <SimpleHeader logoSrc="/images/josoorlogo.png" logoAlt="Josoor" />
        <Hero
          title="Digital Twin of a Government Organization"
          subtitle="Welcome to the Human-Centric Era of AI"
          buttonText="A vision of Transforming Strategy Execution"
          buttonHref="/josoor/vision"
          videoUrl="/images/josoor.mp4"
          align="center"
        />

        <div className="container mx-auto py-16 pr-1 space-y-12">
            <TextBlock
                heading="eXplore"
                content="Explore the Digital Twin Model anatomy and how it is designed. This covers the Knowledge domains used, the Data Ontology, the Database Model"
                maxWidth="full"
                icon={Search}
                darkTheme={true}
                flexLayout={true}
            />
            <Frame layout="horizontal" gap="4" justify="start" align="stretch" padding="6" width="full" bgColor="gray-50" border="true" shadow="sm" className="rounded-lg grid grid-cols-1 md:grid-cols-2">
                <TextBlock
                    heading="Think like an Architect"
                    content={`Access the Body of Knowledge used to map business concepts, organizational components and their relations from an Architect's point of view. \nStructured as a self-paced training Journey, across 4 Chapters and 16 Episodes, you will revisit business and management concepts from a unique Integration Angle`}
                    maxWidth="full"
                    icon={Compass}
                />
                <TextBlock
                    heading='"System of Systems" Architecture'
                    content={`Comprehensive information modeling and ontology design to create twins of components comprising an organization, linked for a full twin model.\n\nBeyond just data, an Enterprise-grade database architecture that is Context-driven, AI-Native, Self-regulating with built in Risk Monitoring.`}
                    maxWidth="full"
                    icon={Network}
                />
            </Frame>

            <TextBlock
                heading="eXperience"
                content="With a Digital Twin, everything appears the same, yet everything is different. To illustrate, experience 3 powerful interfaces to your transformation."
                maxWidth="full"
                icon={Eye}
                darkTheme={true}
                flexLayout={true}
            />
            <Frame layout="horizontal" gap="4" justify="start" align="stretch" padding="6" width="full" bgColor="gray-50" border="true" shadow="sm" className="rounded-lg grid grid-cols-1 md:grid-cols-2">
                 <TextBlock
                    heading="Transformation AI Assistant"
                    content="Chat with Noor, here to help and guide on everything related to the transformation. Make sure to ask about the '5 year transformation journey' he currently supports"
                    maxWidth="prose"
                    icon={Brain}
                />
                <TextBlock
                    heading="Analytics Gymnastics"
                    content={`The twin model unlocks the complexities turning them into structured and valuable insights, where even "classical reports" are enriched.\nWe cover 2 of our favorites here`}
                    maxWidth="prose"
                    icon={BarChart3}
                />
            </Frame>

            <TextBlock
                heading="eXecute"
                content="Our clear, phased approach to digital twin implementation demystifies the journey and its possibilities. Follow our roadmap to get your first use case live in just 90 days."
                maxWidth="full"
                icon={Play}
                darkTheme={true}
                flexLayout={true}
                headingComponent={<span style={{ color: 'rgb(255, 255, 255)' }}>eXecute</span>}
            />
             <Frame layout="horizontal" gap="4" justify="start" align="stretch" padding="6" width="full" bgColor="gray-50" border="true" shadow="sm" className="rounded-lg grid grid-cols-1 md:grid-cols-2">
                 <TextBlock
                    heading="Use Cases Unlocked"
                    content="A collection of some of the use cases unlocked using the digital twin, structured around an Annual Cycle of Business. We see this growing into a live library"
                    maxWidth="prose"
                    icon={BookOpen}
                />
                <TextBlock
                    heading="The Journey to UC001"
                    content={`An Agile approach of Sprints is adopted to gain benefits early on. And to ensure your first UC succeeds check out our "90days to the first UC" approach`}
                    maxWidth="prose"
                    icon={Target}
                />
            </Frame>

        </div>
    </div>
  );
};

export default JosoorPage;
