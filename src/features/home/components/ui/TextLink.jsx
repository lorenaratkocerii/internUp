import { Link } from 'react-router';

export function TextLink({ href, className = '', children }) {
  return (
    <Link
      to={href}
      className={`inline-flex min-h-11 items-center font-semibold text-cream underline decoration-cream/35 decoration-1 underline-offset-[6px] transition-colors duration-200 hover:decoration-cream ${className}`}
    >
      {children}
    </Link>
  );
}
