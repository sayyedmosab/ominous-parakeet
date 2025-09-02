import React from 'react';

interface FrameProps {
  layout?: 'vertical' | 'horizontal';
  gap?: string;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  padding?: string;
  isSticky?: 'true' | 'false';
  width?: 'auto' | 'full';
  bgColor?: string;
  border?: 'true' | 'false';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children?: React.ReactNode;
  className?: string;
}

const Frame: React.FC<FrameProps> = ({
  layout = 'vertical',
  gap = '4',
  justify = 'start',
  align = 'stretch',
  padding = '4',
  isSticky = 'false',
  width = 'auto',
  bgColor = 'transparent',
  border = 'false',
  shadow = 'none',
  children,
  className = '',
}) => {
  const baseClasses = 'flex';
  
  const layoutClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignItemsClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const widthClasses = {
    auto: 'w-auto',
    full: 'w-full',
  };
  
  const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      '2xl': 'shadow-2xl',
  };

  // Tailwind doesn't support negative paddings/gaps directly in JIT with arbitrary values like "p-[-22]".
  // So we handle them via style attribute if they are negative.
  const gapStyle = parseInt(gap) < 0 ? { gap: `${gap}rem` } : {};
  const paddingStyle = parseInt(padding) < 0 ? { padding: `${parseInt(padding)/4}rem` } : {};
  const gapClass = parseInt(gap) >= 0 ? `gap-${gap}` : '';
  const paddingClass = parseInt(padding) >= 0 ? `p-${padding}` : '';

  const finalClassName = [
    baseClasses,
    layoutClasses[layout],
    gapClass,
    justifyClasses[justify],
    alignItemsClasses[align],
    paddingClass,
    isSticky === 'true' ? 'sticky top-0 z-40' : '',
    widthClasses[width],
    bgColor !== 'transparent' ? `bg-${bgColor}` : '',
    border === 'true' ? 'border border-gray-200' : '',
    shadowClasses[shadow],
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={finalClassName} style={{...gapStyle, ...paddingStyle}}>
      {children}
    </div>
  );
};

export default Frame;
