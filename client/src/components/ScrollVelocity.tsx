import React from 'react';
import './ScrollVelocity.css';

interface ScrollVelocityProps {
  texts: string[];
  className?: string;
  parallaxClassName?: string;
  scrollerClassName?: string;
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  texts = [],
  className = '',
  parallaxClassName = 'parallax',
  scrollerClassName = 'scroller'
}) => {
  return (
    <section>
      {texts.map((text: string, index: number) => (
        <div key={index} className={parallaxClassName}>
          <div className={`${scrollerClassName} ${index % 2 === 0 ? 'reverse' : ''}`}>
            <span className={className}>
              {text}&nbsp;
            </span>
            <span className={className}>
              {text}&nbsp;
            </span>
            <span className={className}>
              {text}&nbsp;
            </span>
            <span className={className}>
              {text}&nbsp;
            </span>
            <span className={className}>
              {text}&nbsp;
            </span>
            <span className={className}>
              {text}&nbsp;
            </span>
            <span className={className}>
              {text}&nbsp;
            </span>
            <span className={className}>
              {text}&nbsp;
            </span>
            <span className={className}>
              {text}&nbsp;
            </span>
            <span className={className}>
              {text}&nbsp;
            </span>
            <span className={className}>
              {text}&nbsp;
            </span>
            <span className={className}>
              {text}&nbsp;
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ScrollVelocity;
