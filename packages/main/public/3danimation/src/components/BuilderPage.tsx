import { useState, useEffect } from 'react';
import { builder, Builder } from '@builder.io/react';
import { RubiksCubeExperience } from './RubiksCubeExperience';

// Configure Builder.io
builder.init('YOUR_BUILDER_PUBLIC_KEY'); // Replace with your actual key

interface BuilderContent {
  title?: string;
  description?: string;
  heroText?: string;
  callToAction?: string;
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  showAnimation?: boolean;
  animationPosition?: 'top' | 'middle' | 'bottom';
}

export const BuilderPage = ({ urlPath }: { urlPath: string }) => {
  const [content, setContent] = useState<BuilderContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch content from Builder.io
    builder
      .get('page', {
        url: urlPath,
        options: {
          includeRefs: true,
        },
      })
      .promise()
      .then((content) => {
        setContent(content?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Builder.io fetch error:', error);
        setLoading(false);
      });
  }, [urlPath]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!content) {
    // Fallback to just the 3D experience if no Builder content
    return (
      <div className="size-full bg-black">
        <RubiksCubeExperience />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Builder.io content */}
      {content.heroText && (
        <section className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              {content.title || "3D Neural Transformation"}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {content.description || "Watch a Rubik's cube transform into a living brain through 9 stunning animation phases"}
            </p>
            <div className="text-lg text-cyan-400">
              {content.heroText}
            </div>
            {content.callToAction && (
              <button className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all">
                {content.callToAction}
              </button>
            )}
          </div>
        </section>
      )}

      {/* 3D Animation Section */}
      {content.showAnimation !== false && (
        <section className="relative">
          <RubiksCubeExperience />
          {/* Overlay content if needed */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full flex items-end justify-center pb-20">
              <div className="text-center text-white/80 max-w-md">
                <p className="text-sm">Scroll to experience the transformation</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {content.features && content.features.length > 0 && (
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {content.features.map((feature, index) => (
                <div key={index} className="text-center text-white">
                  <div className="text-4xl mb-4">{feature.icon || "🧠"}</div>
                  <h3 className="text-xl font-semibold mb-3 text-cyan-400">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};