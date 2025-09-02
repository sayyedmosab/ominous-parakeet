import React from 'react';
import { Link } from 'react-router-dom';

interface HeroProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  imageUrl?: string;
  videoUrl?: string;
  embedUrl?: string; // e.g. '/3danimation/index.html'
  embedComponent?: React.ReactNode; // React 3D component to render
  embedInteractive?: boolean; // enable pointer events on embed
  embedOnTop?: boolean; // render embed above content
  overlayOpacity?: number; // 0..1
  align?: 'left' | 'center' | 'right';
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  buttonText,
  buttonHref,
  imageUrl,
  videoUrl,
  embedUrl,
  embedComponent,
  embedInteractive = false,
  embedOnTop = false,
  overlayOpacity = 0.6,
  align = 'left',
}) => {
  const alignClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  } as const;

  const buttonClasses =
    'w-auto px-8 py-3 bg-electric-blue-600 text-white font-bold shadow-md hover:bg-electric-blue-700 transition-all duration-300';

  return (
    <section className="relative w-full h-0 overflow-visible flex items-start justify-start">
      {/* Background media (video fixed to create non-scrolling effect) */}
      {!embedUrl && videoUrl && (
        <video
          className="fixed top-0 left-0 w-screen h-screen object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {!embedUrl && !videoUrl && imageUrl && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}


      {/* Content */}
      {(title || subtitle || buttonText) && (
        <div
          className={`relative z-10 flex flex-col justify-start h-full px-6 sm:px-10 ${alignClasses[align]}`}
        >
          <div className="w-[30vw] shrink-0">
            {title && (
              <h1
                className="font-bold text-white leading-tight mb-3"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 4rem)', lineHeight: 1.1 as unknown as string }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p
                className="text-gray-200 mb-8"
                style={{ fontSize: 'clamp(1rem, 1.5vw, 1.5rem)', lineHeight: 1.6 as unknown as string }}
              >
                <strong>The Mission: </strong>
                {subtitle.replace('The Mission: ', '')}
              </p>
            )}
            {buttonText && (
              buttonHref ? (
                <Link to={buttonHref} className={buttonClasses}>
                  {buttonText}
                </Link>
              ) : (
                <button className={buttonClasses}>{buttonText}</button>
              )
            )}
          </div>
        </div>
      )}

      {/* Embed either behind or on top depending on flag */}
      {(embedUrl || embedComponent) && !embedOnTop && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: embedInteractive ? 'auto' : 'none' }}
        >
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="background-animation"
              className="absolute inset-0 w-full h-full"
              style={{ border: '0' }}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full">{embedComponent}</div>
          )}
        </div>
      )}
      {(embedUrl || embedComponent) && embedOnTop && (
        <div
          className="absolute inset-0 w-full h-full z-20"
          style={{ pointerEvents: embedInteractive ? 'auto' : 'none' }}
        >
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="foreground-animation"
              className="absolute inset-0 w-full h-full"
              style={{ border: '0' }}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full">{embedComponent}</div>
          )}
        </div>
      )}
    </section>
  );
};

export default Hero;
