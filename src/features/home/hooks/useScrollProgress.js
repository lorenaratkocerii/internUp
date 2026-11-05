import { useEffect, useRef, useState } from 'react';

export function useScrollProgress(anchor = 0.7) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return undefined;
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!ref.current) return;
      const { top, height } = ref.current.getBoundingClientRect();
      const value = (window.innerHeight * anchor - top) / height;
      setProgress(Math.min(1, Math.max(0, value)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [anchor]);

  return [ref, progress];
}
