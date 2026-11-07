import { acceptsApplications } from './applicationStatus';
import { CandidateStatus } from './candidateApplication';

const REVIEW_QUEUE = [CandidateStatus.PENDING, CandidateStatus.UNDER_REVIEW];

export const acceptedCountFor = (applications, internshipId) =>
  applications.filter((item) => item.internshipId === internshipId && item.status === CandidateStatus.ACCEPTED).length;

export function computeCompanyStats(internships, applications, now = new Date()) {
  const byStatus = (status) => applications.filter((item) => item.status === status).length;
  return Object.freeze({
    activePositions: internships.filter((internship) => acceptsApplications(internship, now)).length,
    totalPositions: internships.length,
    totalApplications: applications.length,
    candidates: new Set(applications.map((item) => item.student.email)).size,
    awaitingReview: applications.filter((item) => REVIEW_QUEUE.includes(item.status)).length,
    shortlisted: byStatus(CandidateStatus.SHORTLISTED),
    accepted: byStatus(CandidateStatus.ACCEPTED),
    rejected: byStatus(CandidateStatus.REJECTED),
    openSeats: internships
      .filter((internship) => acceptsApplications(internship, now))
      .reduce((sum, internship) => sum + Math.max(0, internship.seats - acceptedCountFor(applications, internship.id)), 0),
  });
}
