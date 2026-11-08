import { useState } from 'react';
import { Landmark } from 'lucide-react';

export function UniversityLogo({ university, className = 'size-16', padding = 'p-2', bare = false }) {
  const [failed, setFailed] = useState(false);

  if (!university.logo || failed) {
    return (
      <span className={`grid shrink-0 place-items-center bg-charcoal text-cream ${className}`}>
        <Landmark aria-hidden="true" strokeWidth={1.5} className="size-1/2" />
      </span>
    );
  }
  if (bare) {
    return (
      <span className={`grid shrink-0 place-items-center ${className}`}>
        <img
          src={university.logo}
          alt={`Logoja e ${university.shortName}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-contain object-left mix-blend-multiply"
        />
      </span>
    );
  }

  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden bg-white ${padding} ${className}`}>
      <img
        src={university.logo}
        alt={`Logoja e ${university.shortName}`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="size-full object-contain"
      />
    </span>
  );
}
