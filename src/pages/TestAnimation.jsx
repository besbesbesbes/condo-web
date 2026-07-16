import React, { forwardRef } from "react";

const ANIMATION_HEADER_DURATION = 500;
const ANIMATION_HEADER_DELAY = 50;
const ANIMATION_CONTENT_DURATION = 500;
const ANIMATION_CONTENT_DELAY = 50;

const AnimatedHeader = forwardRef(
  ({ children, className = "", style = {}, idx, ...props }, ref) => (
    <div
      ref={ref}
      className={`trans-list-item ${className}`}
      style={{
        animationDuration: `${ANIMATION_HEADER_DURATION}ms`,
        animationDelay: `${idx * ANIMATION_HEADER_DELAY}ms`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  ),
);

const AnimatedContent = forwardRef(
  ({ children, className = "", style = {}, idx, ...props }, ref) => (
    <div
      ref={ref}
      className={`trans-list-item ${className}`}
      style={{
        animationDuration: `${ANIMATION_HEADER_DURATION}ms`,
        animationDelay: `${idx * ANIMATION_HEADER_DELAY}ms`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  ),
);

const content01 = [1, 2, 3, 4, 5, 6, 7, 8];

function TestAnimation() {
  return (
    <div className="w-full flex flex-col items-center gap-4 py-4">
      <AnimatedHeader
        className="w-9/11 min-h-[40px] border flex items-center p-2 gap-2"
        idx={0}
      >
        {content01.map((el, idx) => (
          <AnimatedContent
            className="w-[30px] h-[30px] border flex justify-center items-center"
            idx={idx}
          >
            {el}
          </AnimatedContent>
        ))}
      </AnimatedHeader>
      <AnimatedHeader
        className="w-9/11 min-h-[40px] border flex items-center p-2 gap-2"
        idx={1}
      >
        {content01.map((el, idx) => (
          <AnimatedContent
            className="w-[30px] h-[30px] border flex justify-center items-center"
            idx={idx}
          >
            {el}
          </AnimatedContent>
        ))}
      </AnimatedHeader>
      <AnimatedHeader
        className="w-9/11 min-h-[40px] border flex items-center p-2 gap-2"
        idx={2}
      >
        {content01.map((el, idx) => (
          <AnimatedContent
            className="w-[30px] h-[30px] border flex justify-center items-center"
            idx={idx}
          >
            {el}
          </AnimatedContent>
        ))}
      </AnimatedHeader>
      <AnimatedHeader
        className="w-9/11 min-h-[40px] border flex items-center p-2 gap-2"
        idx={3}
      >
        {content01.map((el, idx) => (
          <AnimatedContent
            className="w-[30px] h-[30px] border flex justify-center items-center"
            idx={idx}
          >
            {el}
          </AnimatedContent>
        ))}
      </AnimatedHeader>
      <AnimatedHeader
        className="w-9/11 min-h-[40px] border flex items-center p-2 gap-2"
        idx={4}
      >
        {content01.map((el, idx) => (
          <AnimatedContent
            className="w-[30px] h-[30px] border flex justify-center items-center"
            idx={idx}
          >
            {el}
          </AnimatedContent>
        ))}
      </AnimatedHeader>
      <AnimatedHeader
        className="w-9/11 min-h-[40px] border flex items-center p-2 gap-2"
        idx={5}
      >
        {content01.map((el, idx) => (
          <AnimatedContent
            className="w-[30px] h-[30px] border flex justify-center items-center"
            idx={idx}
          >
            {el}
          </AnimatedContent>
        ))}
      </AnimatedHeader>
      <AnimatedHeader
        className="w-9/11 min-h-[40px] border flex items-center p-2 gap-2"
        idx={6}
      >
        {content01.map((el, idx) => (
          <AnimatedContent
            className="w-[30px] h-[30px] border flex justify-center items-center"
            idx={idx}
          >
            {el}
          </AnimatedContent>
        ))}
      </AnimatedHeader>
      <AnimatedHeader
        className="w-9/11 min-h-[40px] border flex items-center p-2 gap-2"
        idx={7}
      >
        {content01.map((el, idx) => (
          <AnimatedContent
            className="w-[30px] h-[30px] border flex justify-center items-center"
            idx={idx}
          >
            {el}
          </AnimatedContent>
        ))}
      </AnimatedHeader>
      <AnimatedHeader
        className="w-9/11 min-h-[40px] border flex items-center p-2 gap-2"
        idx={8}
      >
        {content01.map((el, idx) => (
          <AnimatedContent
            className="w-[30px] h-[30px] border flex justify-center items-center"
            idx={idx}
          >
            {el}
          </AnimatedContent>
        ))}
      </AnimatedHeader>
      <AnimatedHeader
        className="w-9/11 min-h-[40px] border flex items-center p-2 gap-2"
        idx={9}
      >
        {content01.map((el, idx) => (
          <AnimatedContent
            className="w-[30px] h-[30px] border flex justify-center items-center"
            idx={idx}
          >
            {el}
          </AnimatedContent>
        ))}
      </AnimatedHeader>
    </div>
  );
}

export default TestAnimation;
