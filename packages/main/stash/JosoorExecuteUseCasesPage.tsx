import React from 'react';
import Frame from '../../components/Frame';
import TextBlock from '../../components/TextBlock';
import SimpleHeader from '../../components/SimpleHeader';

const UseCaseCard: React.FC<{title: string, description: string}> = ({title, description}) => (
    <div className="bg-slate-50 border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-bold text-lg text-electric-blue-700">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
);

const JosoorExecuteUseCasesPage: React.FC = () => {
    const useCaseGroups = [
        {
            title: "Group 1 of use cases",
            intro: "Start with a brief introduction. Explain what this section is about. Use clear and concise language to engage your audience. You can elaborate on features, benefits, or a specific topic here.",
            cards: [
                { id: 1, title: "Use Case 1", description: "A short description of the feature." },
                { id: 2, title: "Use Case 2", description: "A short description of the feature." },
            ]
        },
        {
            title: "Group 2 of use cases",
            intro: "Start with a brief introduction. Explain what this section is about. Use clear and concise language to engage your audience. You can elaborate on features, benefits, or a specific topic here.",
            cards: [
                { id: 3, title: "Use Case 3", description: "A short description of the feature." },
                { id: 4, title: "Use Case 4", description: "A short description of the feature." },
            ]
        },
        {
            title: "Group 3 of use cases",
            intro: "Start with a brief introduction. Explain what this section is about. Use clear and concise language to engage your audience. You can elaborate on features, benefits, or a specific topic here.",
            cards: [
                { id: 5, title: "Use Case 5", description: "A short description of the feature." },
                { id: 6, title: "Use Case 6", description: "A short description of the feature." },
            ]
        },
        {
            title: "Group 4 of use cases",
            intro: "Start with a brief introduction. Explain what this section is about. Use clear and concise language to engage your audience. You can elaborate on features, benefits, or a specific topic here.",
            cards: [
                { id: 7, title: "Use Case 7", description: "A short description of the feature." },
                { id: 8, title: "Use Case 8", description: "A short description of the feature." },
            ]
        },
    ];

  return (
    <div className="bg-white min-h-screen">
      <SimpleHeader logoSrc="/images/josoorlogo.png" logoAlt="Josoor" />
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-gray-900">eXecute: A Library of Use Cases Unlocked</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {useCaseGroups.map(group => (
                    <Frame key={group.title} layout="vertical" gap="6" justify="start" align="stretch" padding="8" width="full" bgColor="white" border="true" shadow="md" className="rounded-lg">
                        <TextBlock heading={group.title} content={group.intro} maxWidth='prose' />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {group.cards.map(card => (
                                <UseCaseCard key={card.id} title={card.title} description={card.description} />
                            ))}
                        </div>
                    </Frame>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default JosoorExecuteUseCasesPage;
