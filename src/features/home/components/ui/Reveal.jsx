import { useEffect, useRef, useState } from 'react';

export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...props }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const motion = isVisible ? 'translate-y-0 opacity-100' : 'motion-safe:translate-y-6 motion-safe:opacity-0';

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`motion-safe:transition motion-safe:duration-700 motion-safe:ease-out ${motion} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
