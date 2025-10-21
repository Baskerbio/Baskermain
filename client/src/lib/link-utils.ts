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
      return 'rounded-none shape-square';
    case 'pill':
      return 'rounded-full shape-pill';
    case 'rounded-corners':
      return 'shape-rounded-corners';
    case 'diamond':
      return 'shape-diamond';
    case 'ridged':
      return 'rounded-lg shape-ridged';
    case 'wavy':
      return 'rounded-lg shape-wavy';
    case 'rounded':
    default:
      return 'rounded-lg';
  }
};

// Get link styling based on customization
export const getLinkStyling = (link: Link, settings?: any) => {
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
  
  // Border styling - Apply only via inline styles to avoid double borders
  const borderWidth = link.borderWidth || 0;
  const borderStyle = link.borderStyle || 'solid';
  const borderColor = link.borderColor || '#000000';
  
  if (borderWidth > 0) {
    // Apply custom border and override any default borders
    style.border = `${borderWidth}px ${borderStyle} ${borderColor}`;
  } else {
    // No border when width is 0
    style.border = 'none';
  }
  
  // Debug logging
  // Icon border styling - show if width > 0, use global setting for defaults only
  const iconBorderWidth = link.iconBorderWidth || 0;
  const iconBorderColor = link.iconBorderColor || '#000000';
  const iconBorderShape = link.iconBorderShape || 'rounded';
  
  console.log('Icon border shape debug:', {
    iconBorderShape: link.iconBorderShape,
    processedShape: iconBorderShape,
    cssClass: `icon-border-${iconBorderShape}`
  });
  
  // Special border effects
  if (link.borderEffect) {
    switch (link.borderEffect) {
      case 'gradient':
        borderClasses.push('border-gradient');
        break;
      case 'animated':
        borderClasses.push('border-animated');
        break;
      case 'neon':
        borderClasses.push('border-neon');
        break;
      case 'glow':
        borderClasses.push('border-glow');
        break;
    }
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
    hasCustomBorder: borderWidth > 0,
    iconColor,
    iconBorderWidth: iconBorderWidth > 0 ? `${iconBorderWidth}px` : '0px',
    iconBorderColor: iconBorderColor,
    iconBorderStyle: iconBorderWidth > 0 ? 'solid' : 'none',
    iconBorderShape: `icon-border-${iconBorderShape}`,
    pixelTransition: link.pixelTransition || false,
    pixelTransitionText: link.pixelTransitionText || '',
    pixelTransitionColor: link.pixelTransitionColor || '#000000',
    pixelTransitionGridSize: link.pixelTransitionGridSize || 7,
    pixelTransitionDuration: link.pixelTransitionDuration || 0.3,
  };
};
