import {
  CalendarCheck,
  CalendarX,
  Clock,
  Hourglass,
  Laptop,
  MapPin,
  Users,
  Wallet,
} from 'lucide-react';

const MONTHS = [
  'janar',
  'shkurt',
  'mars',
  'prill',
  'maj',
  'qershor',
  'korrik',
  'gusht',
  'shtator',
  'tetor',
  'nëntor',
  'dhjetor',
];

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export function PositionFacts({ position }) {
  const facts = [
    { icon: MapPin, label: 'Lokacioni', value: position.location },
    { icon: Laptop, label: 'Mënyra e punës', value: ({ Remote: 'Në distancë', Hybrid: 'Hibrid', 'On-site': 'Në zyrë' })[position.workMode] ?? position.workMode },
    { icon: Hourglass, label: 'Kohëzgjatja', value: `${position.durationMonths} muaj` },
    { icon: Clock, label: 'Orari', value: position.schedule },
    { icon: Wallet, label: 'Pagesa', value: position.paid ? (position.stipend ? `${position.stipend} € / muaj` : 'Me pagesë') : 'Pa pagesë' },
    { icon: Users, label: 'Vende të lira', value: position.seats },
    { icon: CalendarCheck, label: 'Hapja e aplikimit', value: formatDate(position.opensAt) },
    { icon: CalendarX, label: 'Mbyllja e aplikimit', value: formatDate(position.closesAt) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label}>
          <dt className="flex items-center gap-1.5 text-xs font-semibold text-mauve">
            <Icon aria-hidden="true" className="size-3.5 shrink-0" />
            {label}
          </dt>
          <dd className="mt-1 text-sm font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
