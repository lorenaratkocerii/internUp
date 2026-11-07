import { CANDIDATE_STATUS_LABELS, CandidateStatus } from '../../../domain/internship/candidateApplication';

const STYLES = {
  [CandidateStatus.PENDING]: 'bg-cream/20 text-charcoal',
  [CandidateStatus.UNDER_REVIEW]: 'bg-navy/10 text-navy',
  [CandidateStatus.SHORTLISTED]: 'bg-terracotta/15 text-terracotta',
  [CandidateStatus.ACCEPTED]: 'bg-olive/20 text-olive',
  [CandidateStatus.REJECTED]: 'bg-burgundy/12 text-burgundy',
};

export function CandidateStatusBadge({ status, tone = 'light', className = '' }) {
  const style =
    tone === 'dark' ? 'bg-cream text-charcoal' : STYLES[status] ?? STYLES[CandidateStatus.PENDING];
  return (
    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${style} ${className}`}>
      {CANDIDATE_STATUS_LABELS[status] ?? status}
    </span>
  );
}
