import { useEffect, useRef, useState } from 'react';

export function FadeImage({ className = '', onError, ...props }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <img
      ref={ref}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={onError}
      className={`transition-[opacity,transform] duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      {...props}
    />
  );
}
