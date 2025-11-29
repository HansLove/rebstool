/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useRef, useState } from "react";

export const ScrollMotionDiv: FC<{
    children: React.ReactNode;
    delay?: number;
    className?: string;
  }> = ({ children, delay = 0, className = "" }:any) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const node = ref.current;
      if (!node) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delay);
            obs.unobserve(node);
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(node);
      return () => obs.disconnect();
    }, [delay]);
  
    return (
      <div
        ref={ref}
        className={`${className} transition-all duration-700 transform ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {children}
      </div>
    );
  };
  