import { useEffect, useRef, useState } from "react";

interface ScrollStaggeredTextProps {
  text: string;
  staggerDelay?: number;
  baseDelay?: number;
}

export const ScrollStaggeredText = ({
  text,
  staggerDelay = 0.05,
  baseDelay = 0,
}: ScrollStaggeredTextProps) => {
  const words = text.split(" ");
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const current = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (current) observer.unobserve(current);
        }
      },
      { threshold: 0.1 }
    );

    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div ref={ref} className="flex flex-wrap">
      {words.map((word, i) => (
        <div
          key={i}
          className={`mr-1 mb-1 transition-all duration-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: isVisible ? `${baseDelay + i * staggerDelay}s` : "0s",
          }}
        >
          {word}
        </div>
      ))}
    </div>
  );
};