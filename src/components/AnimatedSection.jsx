import React, { forwardRef } from "react";

const DURATION = 320;
const DELAY = 24;
const AnimatedSection = forwardRef(
  (
    {
      children,
      className = "",
      style = {},
      index = 0,
      duration = DURATION,
      delay = DELAY,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`animated-div ${className}`.trim()}
        style={{
          animationDuration: `${duration}ms`,
          animationDelay: `${index * delay}ms`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

AnimatedSection.displayName = "AnimatedSection";

export default AnimatedSection;
