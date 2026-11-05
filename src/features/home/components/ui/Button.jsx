import { Link } from 'react-router';

const base =
  'group inline-flex min-h-12 items-center justify-center gap-3 px-6 py-3 text-base font-semibold transition-colors duration-300';

const variants = {
  cream: 'bg-cream text-charcoal hover:bg-cream/85',
  charcoal: 'bg-charcoal text-cream hover:bg-navy',
  ghost: 'border border-cream/40 text-cream hover:border-cream hover:bg-cream/10',
  outline: 'border border-charcoal/40 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-cream',
  disabled: 'cursor-not-allowed bg-charcoal/15 text-charcoal/70',
};

export function buttonClasses(variant = 'cream', className = '') {
  return `${base} ${variants[variant]} ${className}`;
}

export function ButtonLink({ href, variant, className, icon: Icon, children, ...props }) {
  const content = (
    <>
      {children}
      {Icon && (
        <Icon
          aria-hidden="true"
          className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </>
  );
  const classes = buttonClasses(variant, className);

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...props}>
      {content}
    </a>
  );
}
