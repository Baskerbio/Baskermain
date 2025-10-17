import { Link } from '@shared/schema';

// Utility function to calculate text color based on background color
export const getContrastColor = (backgroundColor: string): string => {
  // Remove # if present
  const hex = backgroundColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Get container shape classes
export const getShapeClasses = (shape: string) => {
  switch (shape) {
    case 'square':
      return 'rounded-none';
    case 'pill':
      return 'rounded-full';
    case 'circle':
      return 'rounded-full aspect-square w-12 h-12 flex items-center justify-center';
    case 'ridged':
      return 'rounded-lg border-2 border-dashed';
    case 'wavy':
      return 'rounded-lg';
    case 'rounded':
    default:
      return 'rounded-lg';
  }
};

// Get link styling based on customization
export const getLinkStyling = (link: Link) => {
  const backgroundColor = link.backgroundColor || undefined;
  const textColor = link.autoTextColor && backgroundColor 
    ? getContrastColor(backgroundColor) 
    : link.textColor || undefined;
  const fontFamily = link.fontFamily && link.fontFamily !== 'system' 
    ? link.fontFamily 
    : undefined;
  const iconColor = link.iconColor || undefined;
  const shapeClasses = getShapeClasses(link.containerShape || 'rounded');
  
  // Only include styling properties that have values
  const style: any = {};
  if (backgroundColor) style.backgroundColor = backgroundColor;
  if (textColor) style.color = textColor;
  if (fontFamily) style.fontFamily = fontFamily;
  
  // Border styling
  if (link.borderColor && link.borderWidth && link.borderWidth > 0) {
    style.borderColor = link.borderColor;
    style.borderWidth = `${link.borderWidth}px`;
    style.borderStyle = link.borderStyle || 'solid';
  }
  
  // Pattern styling
  if (link.pattern && link.pattern !== 'none') {
    const patternColor = link.patternColor || link.textColor || '#000000';
    switch (link.pattern) {
      case 'dots':
        style.backgroundImage = `radial-gradient(circle, ${patternColor} 1px, transparent 1px)`;
        style.backgroundSize = '10px 10px';
        break;
      case 'lines':
        style.backgroundImage = `repeating-linear-gradient(45deg, transparent, transparent 10px, ${patternColor} 10px, ${patternColor} 20px)`;
        break;
      case 'grid':
        style.backgroundImage = `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`;
        style.backgroundSize = '20px 20px';
        break;
      case 'diagonal':
        style.backgroundImage = `repeating-linear-gradient(45deg, transparent, transparent 5px, ${patternColor} 5px, ${patternColor} 10px)`;
        break;
      case 'waves':
        style.backgroundImage = `repeating-linear-gradient(0deg, transparent, transparent 10px, ${patternColor} 10px, ${patternColor} 20px)`;
        break;
    }
  }
  
  return {
    ...style,
    shapeClasses,
    iconColor,
    pixelTransition: link.pixelTransition || false,
    pixelTransitionText: link.pixelTransitionText || '',
    pixelTransitionColor: link.pixelTransitionColor || '#000000',
    pixelTransitionGridSize: link.pixelTransitionGridSize || 7,
    pixelTransitionDuration: link.pixelTransitionDuration || 0.3,
  };
};
