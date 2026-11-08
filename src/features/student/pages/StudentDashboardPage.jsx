import { useCallback, useState } from 'react';
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CalendarDays, CircleDashed, FileText, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { CANDIDATE_STATUSES } from '../../../domain/internship/candidateApplication';
import { CandidateStatusBadge } from '../../applications/components/CandidateStatusBadge';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { formatDay } from '../../company-workspace/utils/format';
import { useWorkspaceData } from '../../company-workspace/hooks/useWorkspaceData';
import { getDemoUser } from '../../login/demoAuth';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { ApplicationModal } from '../components/ApplicationModal';
import { StudentWorkspace } from '../components/StudentWorkspace';
import { UniversityVerificationCard } from '../components/UniversityVerificationCard';
import { applicantDetails, readStudentProfile, recommendedInternships } from '../studentData';

const NO_APPLICATIONS = [];

function Status({ status }) {
  return <CandidateStatusBadge status={status} tone="dark" />;
}

export function StudentDashboardPage({ useCases, verificationUseCases }) {
  useDocumentTitle('Paneli i studentit');
  const user = getDemoUser();
  const actor = useCurrentActor();
  const [profile] = useState(() => readStudentProfile(user));
  const load = useCallback(() => useCases.listMyApplications(actor), [useCases, actor]);
  const { data, reload } = useWorkspaceData(load);
  const applications = data ?? NO_APPLICATIONS;
  const [selectedInternship, setSelectedInternship] = useState(null);
  const currentWeek = 3;
  const totalWeeks = 12;
  const progress = 25;
  const studentName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Student';
  const counts = Object.fromEntries(CANDIDATE_STATUSES.map((status) => [status, applications.filter((application) => application.status === status).length]));
  const appliedIds = new Set(applications.map((application) => application.internshipId));

  const addApplication = async (details) => {
    await useCases.applyToInternship(actor, { internshipId: selectedInternship.id, ...details, student: applicantDetails(profile) });
    await reload();
  };

  return <StudentWorkspace title="Paneli i studentit" subtitle="Përmbledhje">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-cream/55">{new Intl.DateTimeFormat('sq-AL', { dateStyle: 'full' }).format(new Date())}</p><h2 className="mt-2 font-display text-4xl font-medium text-cream sm:text-5xl">Mirë se u ktheve, {profile.firstName || 'Arta'}!</h2><p className="mt-2 text-cream/65">Ja çfarë po ndodh me rrugëtimin tënd profesional.</p></div><Link to="/profili" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cream px-4 py-2.5 font-semibold text-charcoal hover:bg-cream/90">Ndrysho profilin <ArrowUpRight aria-hidden="true" className="size-4" /></Link></div>

    {verificationUseCases && <UniversityVerificationCard useCases={verificationUseCases} actor={actor} profile={profile} />}

    <section aria-label="Progresi i praktikës dhe aktiviteti i aplikimeve" className="mt-7 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <article className="rounded-2xl border border-cream/15 bg-navy p-6 text-cream shadow-lg sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-cream/65">Progresi i Praktikës</p><p className="mt-2 font-display text-3xl">Java {currentWeek} <span className="font-sans text-base text-cream/60">nga {totalWeeks} javë</span></p></div><span className="grid size-11 place-items-center rounded-xl bg-cream/15"><Sparkles aria-hidden="true" className="size-5" /></span></div><div className="mt-5 flex items-center justify-between text-sm"><span className="text-cream/65">Progresi yt</span><span className="font-semibold">{progress}%</span></div><div className="mt-2 h-2.5 overflow-hidden rounded-full bg-charcoal/40"><div className="h-full rounded-full bg-cream transition-[width]" style={{ width: `${progress}%` }} /></div><p className="mt-4 text-sm text-cream/75">Po ecën shumë mirë, vazhdo kështu!</p></article>
      <article className="rounded-2xl border border-cream/15 bg-charcoal/65 p-6 text-cream"><div className="flex items-center justify-between"><div><p className="text-sm text-cream/60">Aktiviteti i Aplikimeve</p><p className="mt-1 font-display text-3xl">{applications.length} <span className="font-sans text-sm font-normal text-cream/55">aplikime gjithsej</span></p></div><Link to="/student/applications" aria-label="Shiko të gjitha aplikimet" className="grid size-10 place-items-center rounded-full border border-cream/20 hover:bg-cream/10"><ArrowRight aria-hidden="true" className="size-4" /></Link></div><div className="mt-5 grid grid-cols-3 gap-2">{[['Under Review', counts['Under Review']], ['Shortlisted', counts.Shortlisted], ['Pending', counts.Pending]].map(([label, value]) => <div key={label} className="rounded-xl bg-cream/5 p-3"><p className="font-display text-2xl">{value}</p><p className="mt-1 text-xs text-cream/55">{{ 'Under Review': 'Në shqyrtim', Shortlisted: 'Në listën e ngushtë', Pending: 'Në pritje' }[label]}</p></div>)}</div></article>
    </section>

    <section className="mt-9" aria-labelledby="recommended-title"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold tracking-[0.16em] text-cream/50 uppercase">Mundësi të zgjedhura për ty</p><h2 id="recommended-title" className="mt-2 font-display text-3xl text-cream">Mundësi të rekomanduara</h2></div><Link to="/kompanite" className="inline-flex items-center gap-2 text-sm font-semibold text-cream/75 hover:text-cream">Shiko të gjitha <ArrowRight aria-hidden="true" className="size-4" /></Link></div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">{recommendedInternships.map((internship) => <article key={internship.id} className="flex flex-col rounded-2xl border border-cream/15 bg-cream p-5 text-charcoal shadow-lg"><div className="flex items-start justify-between gap-3"><span className="grid size-11 place-items-center rounded-xl bg-charcoal text-cream"><BriefcaseBusiness aria-hidden="true" className="size-5" /></span><span className="rounded-full bg-olive/15 px-2.5 py-1 text-xs font-semibold text-olive">{internship.paid ? 'Me pagesë' : 'Pa pagesë'}</span></div><p className="mt-4 text-sm font-semibold text-charcoal/60">{internship.company}</p><h3 className="mt-1 font-display text-2xl">{internship.title}</h3><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-charcoal/65"><span className="inline-flex items-center gap-1"><MapPin aria-hidden="true" className="size-3.5" />{internship.city}</span><span>{{ Hybrid: 'Hibrid', Remote: 'Në distancë', 'On-site': 'Në zyrë' }[internship.type]}</span><span>{internship.duration}</span></div><div className="mt-4 flex flex-wrap gap-1.5">{internship.skills.map((skill) => <span key={skill} className="rounded-full border border-charcoal/15 px-2.5 py-1 text-xs">{skill}</span>)}</div><div className="mt-auto flex items-center justify-between gap-3 pt-5"><span className="text-xs text-charcoal/55">{internship.posted}</span>{appliedIds.has(internship.id) ? <Link to="/student/applications" className="inline-flex min-h-10 items-center rounded-lg border border-charcoal/20 px-4 py-2 text-sm font-semibold hover:bg-charcoal/5">Aplikuar ✓</Link> : <button type="button" onClick={() => setSelectedInternship(internship)} className="min-h-10 rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-cream hover:bg-navy">Apliko Tani</button>}</div></article>)}</div>
    </section>

    <section className="mt-9" aria-labelledby="recent-applications-title"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold tracking-[0.16em] text-cream/50 uppercase">Përditësimet e fundit</p><h2 id="recent-applications-title" className="mt-2 font-display text-3xl text-cream">Aplikimet e fundit</h2></div><Link to="/student/applications" className="inline-flex items-center gap-2 text-sm font-semibold text-cream/75 hover:text-cream">Shiko të gjitha <ArrowRight aria-hidden="true" className="size-4" /></Link></div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-cream/15 bg-charcoal/55">{applications.slice(0, 3).map((application, index) => <article key={application.id} className={`flex flex-wrap items-center justify-between gap-4 p-4 sm:px-5 ${index ? 'border-t border-cream/10' : ''}`}><div className="flex min-w-0 items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cream/10 text-cream"><FileText aria-hidden="true" className="size-4" /></span><div className="min-w-0"><h3 className="truncate font-semibold text-cream">{application.positionTitle}</h3><p className="mt-0.5 text-sm text-cream/55">{application.companyName}</p></div></div><div className="flex items-center gap-4"><span className="hidden items-center gap-1.5 text-xs text-cream/55 sm:flex"><CalendarDays aria-hidden="true" className="size-3.5" />{formatDay(application.submittedAt)}</span><Status status={application.status} /></div></article>)}{applications.length === 0 && <div className="p-6 text-center text-cream/65"><CircleDashed aria-hidden="true" className="mx-auto size-7" /><p className="mt-2">Aplikimet e tua do të shfaqen këtu.</p></div>}</div>
    </section>
    {selectedInternship && <ApplicationModal internship={selectedInternship} studentName={studentName} cvName={profile.documents.cv} onClose={() => setSelectedInternship(null)} onSubmit={addApplication} />}
  </StudentWorkspace>;
}
