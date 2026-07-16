import React, { forwardRef } from "react";

const DURATION = 320;
const DELAY = 24;
const AnimatedDiv = forwardRef(
  (
    {
      children,
      className = "",
      style = {},
      idx = 0,
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
          animationDelay: `${idx * delay}ms`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

AnimatedDiv.displayName = "AnimatedDiv";

export default AnimatedDiv;
