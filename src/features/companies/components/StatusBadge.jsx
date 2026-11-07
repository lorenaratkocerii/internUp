import { CircleCheck, CircleX, Hourglass } from 'lucide-react';
import { ApplicationStatus } from '../../../application/companyUseCases';

const styles = {
  [ApplicationStatus.OPEN]: { icon: CircleCheck, classes: 'bg-navy text-cream', label: 'E hapur' },
  [ApplicationStatus.CLOSING_SOON]: { icon: Hourglass, classes: 'bg-mauve text-cream', label: 'Mbyllet së shpejti' },
  [ApplicationStatus.CLOSED]: { icon: CircleX, classes: 'border border-charcoal/40 text-charcoal/75', label: 'E mbyllur' },
};

export function StatusBadge({ status }) {
  const { icon: Icon, classes, label } = styles[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${classes}`}>
      <Icon aria-hidden="true" className="size-3.5" />
      {label}
    </span>
  );
}
