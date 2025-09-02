import React from 'react';

interface TextBlockProps {
  heading: string;
  content: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'prose';
  icon?: React.ComponentType<any>;
  iconColor?: string;
  darkTheme?: boolean;
  flexLayout?: boolean;
  headingComponent?: React.ReactNode;
}

const TextBlock: React.FC<TextBlockProps> = ({
  heading,
  content,
  maxWidth = 'full',
  icon: IconComponent,
  iconColor = 'text-electric-blue-600',
  darkTheme = false,
  flexLayout = false,
  headingComponent
}) => {
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-full',
        prose: 'max-w-prose',
    };

    const containerClasses = `py-8 px-4 ${maxWidthClasses[maxWidth]} mx-auto ${
      darkTheme ? 'bg-black text-white' : ''
    } ${flexLayout ? 'flex flex-row' : ''}`;

    const headingClasses = `text-3xl font-bold ${
      darkTheme ? 'text-white' : 'text-gray-900'
    } ${flexLayout ? 'pr-5' : ''}`;

    const contentClasses = `leading-relaxed whitespace-pre-line ${
      darkTheme ? 'text-white' : 'text-gray-600'
    } ${flexLayout ? 'pl-5' : ''}`;

  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-3 mb-4">
        {IconComponent && (
          <div className="p-2 bg-electric-blue-50 rounded-lg">
            <IconComponent className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
        <h2 className={headingClasses}>
          {headingComponent || heading}
        </h2>
      </div>
      <p className={contentClasses}>{content}</p>
    </div>
  );
};

export default TextBlock;
