import {
  BrainCircuit,
  ChartColumn,
  Cloud,
  Compass,
  Cpu,
  CreditCard,
  GraduationCap,
  Hexagon,
  Leaf,
  Megaphone,
  Moon,
  Mountain,
  Palette,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from 'lucide-react';

const marks = {
  'kodra-labs': Mountain,
  'vala-studio': Palette,
  'rrjeti-media': Megaphone,
  datara: ChartColumn,
  'ura-systems': Hexagon,
  'malesia-cloud': Cloud,
  'dardan-pay': CreditCard,
  'gjelber-energy': Leaf,
  'qarku-tech': Cpu,
  'dija-soft': GraduationCap,
  'mendja-ai': BrainCircuit,
  'mburoja-security': ShieldCheck,
  'hena-code': Moon,
  'shporta-commerce': ShoppingCart,
  'busulla-consulting': Compass,
  'rruga-logistics': Truck,
};

export function CompanyMark({ companyId, className = '' }) {
  const Mark = marks[companyId] ?? Hexagon;
  return <Mark aria-hidden="true" strokeWidth={1.5} className={className} />;
}

export function CompanyLogo({ companyId, logo, name = '', className = 'size-12', iconClassName = 'size-6' }) {
  if (logo) {
    return (
      <span className={`grid shrink-0 place-items-center overflow-hidden bg-white ${className}`}>
        <img src={logo} alt={name ? `Logoja e ${name}` : ''} className="size-full object-contain" />
      </span>
    );
  }
  return (
    <span className={`grid shrink-0 place-items-center bg-charcoal text-cream ${className}`}>
      <CompanyMark companyId={companyId} className={iconClassName} />
    </span>
  );
}
