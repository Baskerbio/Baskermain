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
      return 'rounded-full aspect-square';
    case 'rounded':
    default:
      return 'rounded-lg';
  }
};

// Get link styling based on customization
export const getLinkStyling = (link: Link) => {
  const backgroundColor = link.backgroundColor || '';
  const textColor = link.autoTextColor && backgroundColor 
    ? getContrastColor(backgroundColor) 
    : link.textColor || '';
  const fontFamily = link.fontFamily && link.fontFamily !== 'system' 
    ? link.fontFamily 
    : 'inherit';
  const shapeClasses = getShapeClasses(link.containerShape || 'rounded');
  
  return {
    backgroundColor,
    color: textColor,
    fontFamily,
    shapeClasses,
  };
};
