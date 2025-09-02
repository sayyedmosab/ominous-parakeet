import React from 'react';

const FontCard: React.FC<{ title: string; fontFamilyClass: string; }> = ({ title, fontFamilyClass }) => {
    const textSample = "The quick brown fox jumps over the lazy dog.";
    const alphabet = "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz";
    const paragraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.";

    return (
        <div className={`border border-gray-200 rounded-lg p-6 bg-white shadow-sm ${fontFamilyClass}`}>
            <h2 className="text-2xl font-bold border-b pb-2 mb-4 font-sans text-gray-800">Font: {title}</h2>
            <h3 className="text-4xl font-bold mb-4 text-gray-900">{textSample}</h3>
            <p className="text-lg mb-4 text-gray-700">{alphabet}</p>
            <p className="text-base leading-relaxed text-gray-600">{paragraph}</p>
        </div>
    );
}

const FontShowcasePage: React.FC = () => {
    return (
        <div className="bg-gray-50 py-12 min-h-[80vh]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl font-bold text-gray-900 text-center mb-12">Font Showcase</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FontCard title="Lato" fontFamilyClass="font-lato" />
                    <FontCard title="Lexend" fontFamilyClass="font-lexend" />
                    <FontCard title="Source Serif Pro" fontFamilyClass="font-serif-pro" />
                    <FontCard title="JetBrains Mono" fontFamilyClass="font-mono-jetbrains" />
                </div>
            </div>
        </div>
    );
};

export default FontShowcasePage;
