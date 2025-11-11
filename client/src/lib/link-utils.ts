import { Link } from '@shared/schema';

const backgroundPositionMap: Record<string, string> = {
  center: 'center',
  top: 'center top',
  bottom: 'center bottom',
  left: 'left center',
  right: 'right center',
  'top-left': 'left top',
  'top-right': 'right top',
  'bottom-left': 'left bottom',
  'bottom-right': 'right bottom',
};

export const hexToRgba = (color: string, alpha: number) => {
  if (!color) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  if (color.startsWith('rgba')) {
    return color;
  }

  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }

  let hex = color.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((char) => char + char).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
export const getLinkStyling = (link: Link, settings?: any, theme?: any) => {
  // Only apply theme defaults if:
  // 1. Theme patterns are enabled
  // 2. Link has NO custom background color (not just empty string, but truly undefined/null)
  // 3. Theme has default background color defined
  const useThemeDefault = theme?.enableThemePatterns && 
                         (link.backgroundColor === undefined || link.backgroundColor === null || link.backgroundColor === '') && 
                         theme?.defaultLinkBackground;
  
  const backgroundColor = link.backgroundColor || (useThemeDefault ? theme.defaultLinkBackground : undefined);
  
  // Only apply theme default text color if link has no custom text color
  const useThemeTextDefault = theme?.enableThemePatterns && 
                             (link.textColor === undefined || link.textColor === null || link.textColor === '') && 
                             theme?.defaultLinkTextColor;
  const defaultTextColor = useThemeTextDefault ? theme.defaultLinkTextColor : undefined;
  
  const textColor = link.autoTextColor && backgroundColor 
    ? getContrastColor(backgroundColor) 
    : link.textColor || defaultTextColor || undefined;
  const fontFamily = link.fontFamily && link.fontFamily !== 'system' 
    ? link.fontFamily 
    : undefined;
  const fontWeight = link.fontWeight || undefined;
  const iconColor = link.iconColor || undefined;
  const shapeClasses = getShapeClasses(link.containerShape || 'rounded');
  const hasBackgroundImage = Boolean(link.backgroundImage);
  
  // Only include styling properties that have values
  const style: any = {};
  if (backgroundColor) style.backgroundColor = backgroundColor;
  if (textColor) style.color = textColor;
  if (fontFamily) style.fontFamily = fontFamily;
  if (fontWeight) style.fontWeight = fontWeight;
  
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

  if (hasBackgroundImage) {
    style.backgroundImage = `url(${link.backgroundImage})`;
    style.backgroundSize = link.backgroundImageSize || 'cover';
    style.backgroundRepeat = link.backgroundImageRepeat || 'no-repeat';
    style.backgroundPosition =
      backgroundPositionMap[link.backgroundImagePosition || 'center'] || 'center';
  }
  
  // Debug logging
  // Icon border styling - show if width > 0, use global setting for defaults only
  const iconBorderWidth = link.iconBorderWidth || 0;
  const iconBorderColor = link.iconBorderColor || '#000000';
  const iconBorderShape = link.iconBorderShape || 'rounded';
  
  // Debug logging commented out for performance
  // console.log('Icon border shape debug:', {
  //   iconBorderShape: link.iconBorderShape,
  //   processedShape: iconBorderShape,
  //   cssClass: `icon-border-${iconBorderShape}`
  // });
  
  // Special border effects (to be applied via CSS classes if needed in the future)
  // const borderClasses: string[] = [];
  // if (link.borderEffect) {
  //   switch (link.borderEffect) {
  //     case 'gradient':
  //       borderClasses.push('border-gradient');
  //       break;
  //     case 'animated':
  //       borderClasses.push('border-animated');
  //       break;
  //     case 'neon':
  //       borderClasses.push('border-neon');
  //       break;
  //     case 'glow':
  //       borderClasses.push('border-glow');
  //       break;
  //   }
  // }
  
  // Pattern styling
  let patternApplied = false;
  if (!hasBackgroundImage && link.pattern && link.pattern !== 'none') {
    const patternColor = link.patternColor || link.textColor || '#000000';
    switch (link.pattern) {
      case 'dots':
        style.backgroundImage = `radial-gradient(circle, ${patternColor} 1px, transparent 1px)`;
        style.backgroundSize = '10px 10px';
        patternApplied = true;
        break;
      case 'lines':
        style.backgroundImage = `repeating-linear-gradient(45deg, transparent, transparent 10px, ${patternColor} 10px, ${patternColor} 20px)`;
        patternApplied = true;
        break;
      case 'grid':
        style.backgroundImage = `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`;
        style.backgroundSize = '20px 20px';
        patternApplied = true;
        break;
      case 'diagonal':
        style.backgroundImage = `repeating-linear-gradient(45deg, transparent, transparent 5px, ${patternColor} 5px, ${patternColor} 10px)`;
        patternApplied = true;
        break;
      case 'waves':
        style.backgroundImage = `repeating-linear-gradient(0deg, transparent, transparent 10px, ${patternColor} 10px, ${patternColor} 20px)`;
        patternApplied = true;
        break;
      case 'themed':
        // Apply theme-specific patterns if theme is enabled
        if (theme?.name === 'halloween' && !patternApplied) {
          const halloweenColor = theme.accentColor || '#ef4444';
          style.backgroundImage = `
            radial-gradient(circle, ${halloweenColor}33 1px, transparent 1px),
            repeating-linear-gradient(45deg, transparent, transparent 5px, ${halloweenColor}22 5px, ${halloweenColor}22 10px)
          `;
          style.backgroundSize = '15px 15px, 20px 20px';
          patternApplied = true;
        }
        break;
    }
  } else if (
    !hasBackgroundImage &&
    theme?.patternStyle === 'themed' &&
    theme?.enableThemePatterns &&
    (link.backgroundColor === undefined || link.backgroundColor === null || link.backgroundColor === '') &&
    theme?.enableThemePatterns !== false
  ) {
    // Apply theme patterns when pattern is 'none' or undefined but theme has themed patterns
    if (theme.name === 'halloween') {
      const halloweenColor = theme.accentColor || '#ef4444';
      style.backgroundImage = `
        radial-gradient(circle, ${halloweenColor}33 1px, transparent 1px),
        repeating-linear-gradient(45deg, transparent, transparent 5px, ${halloweenColor}22 5px, ${halloweenColor}22 10px)
      `;
      style.backgroundSize = '15px 15px, 20px 20px';
      patternApplied = true;
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
    fontWeight: fontWeight,
  };
};
