import { VERIFICATION_STATUS_LABELS, VerificationStatus } from '../../../domain/university/studentVerification';

const tones = {
  [VerificationStatus.PENDING]: 'border border-charcoal/25 text-charcoal/75',
  [VerificationStatus.VERIFIED]: 'bg-olive text-cream',
  [VerificationStatus.REJECTED]: 'bg-burgundy text-cream',
};

const darkTones = {
  [VerificationStatus.PENDING]: 'border border-cream/30 text-cream/80',
  [VerificationStatus.VERIFIED]: 'bg-olive text-cream',
  [VerificationStatus.REJECTED]: 'bg-burgundy text-cream',
};

export function VerificationBadge({ status, dark = false }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${(dark ? darkTones : tones)[status]}`}>
      {VERIFICATION_STATUS_LABELS[status]}
    </span>
  );
}
