import {
  ArrowRight,
  BadgeCheck,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CircleDashed,
  ClipboardList,
  FileText,
  PlusCircle,
  UserCheck,
  Users,
} from 'lucide-react';
import { useCallback } from 'react';
import { Link } from 'react-router';
import { StatusBadge } from '../../companies/components/StatusBadge';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { CandidateStatusBadge } from '../../applications/components/CandidateStatusBadge';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { CompanyWorkspace } from '../components/CompanyWorkspace';
import { WorkspaceError, WorkspaceLoading } from '../components/WorkspaceStatus';
import { useWorkspaceData } from '../hooks/useWorkspaceData';
import { formatDay } from '../utils/format';

function StatCard({ icon: Icon, label, value, detail, href }) {
  return (
    <article className="rounded-2xl border border-cream/15 bg-charcoal/65 p-5 text-cream">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-cream/65">{label}</p>
        <span className="grid size-10 place-items-center rounded-xl bg-cream/10">
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>
      <p className="mt-2 font-display text-4xl tabular-nums">{value}</p>
      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-cream/55">
        <span>{detail}</span>
        {href && (
          <Link to={href} aria-label={`Shiko: ${label}`} className="grid size-8 place-items-center rounded-full border border-cream/20 hover:bg-cream/10">
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        )}
      </div>
    </article>
  );
}

export function CompanyDashboardPage({ useCases }) {
  useDocumentTitle('Paneli i kompanisë');
  const actor = useCurrentActor();
  const load = useCallback(() => useCases.getDashboard(actor), [useCases, actor]);
  const { status, data, error } = useWorkspaceData(load);

  return (
    <CompanyWorkspace title="Paneli i kompanisë" subtitle="Përmbledhje" companyName={data?.company.name}>
      {status === 'loading' && !data && <WorkspaceLoading />}
      {status === 'error' && <WorkspaceError error={error} />}
      {data && <DashboardContent data={data} />}
    </CompanyWorkspace>
  );
}

function DashboardContent({ data }) {
  const { company, positions, recentApplications, stats } = data;
  const reviewProgress = stats.applications
    ? Math.round(((stats.applications - stats.awaitingReview) / stats.applications) * 100)
    : 0;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-cream/55">{new Intl.DateTimeFormat('sq-AL', { dateStyle: 'full' }).format(new Date())}</p>
          <h2 className="mt-2 font-display text-4xl font-medium text-cream sm:text-5xl">Mirë se u ktheve, {company.name}!</h2>
          <p className="mt-2 text-cream/65">Ja çfarë po ndodh me pozitat dhe kandidatët tuaj.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/kompanite/${company.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-cream/25 px-4 py-2.5 font-semibold text-cream hover:bg-cream/10">
            Profili publik <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
          <Link to="/kompani/pozitat/e-re" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cream px-4 py-2.5 font-semibold text-charcoal hover:bg-cream/90">
            <PlusCircle aria-hidden="true" className="size-4" /> Publiko pozitë
          </Link>
        </div>
      </div>

      <section aria-label="Statistikat" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BriefcaseBusiness} label="Pozita aktive" value={stats.activePositions} detail={`nga ${stats.totalPositions} gjithsej`} href="/kompani/pozitat" />
        <StatCard icon={ClipboardList} label="Aplikime" value={stats.applications} detail={`${stats.awaitingReview} presin shqyrtim`} href="/kompani/aplikimet" />
        <StatCard icon={Users} label="Kandidatë" value={stats.candidates} detail={`${stats.shortlisted} në listën e ngushtë`} href="/kompani/aplikimet" />
        <StatCard icon={UserCheck} label="Interns të pranuar" value={stats.accepted} detail="Vendime përfundimtare" />
      </section>

      {stats.pendingVerifications > 0 && (
        <Link to="/kompani/verifikimi" className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-cream/15 bg-cream p-5 text-charcoal transition-colors hover:bg-cream/90">
          <span className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-olive text-cream">
              <BadgeCheck aria-hidden="true" className="size-5" />
            </span>
            <span>
              <span className="block font-semibold">
                {stats.pendingVerifications === 1 ? '1 histori në Student Blog pret verifikimin tuaj' : `${stats.pendingVerifications} histori në Student Blog presin verifikimin tuaj`}
              </span>
              <span className="block text-sm text-charcoal/65">Konfirmoni interns tuaj që historitë të marrin shenjën Verified Intern.</span>
            </span>
          </span>
          <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
        </Link>
      )}

      <section aria-label="Progresi i shqyrtimit" className="mt-5 rounded-2xl border border-cream/15 bg-navy p-6 text-cream shadow-lg sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-cream/65">Progresi i shqyrtimit të aplikimeve</p>
            <p className="mt-2 font-display text-3xl">
              {stats.applications - stats.awaitingReview}{' '}
              <span className="font-sans text-base text-cream/60">nga {stats.applications} të shqyrtuara</span>
            </p>
          </div>
          <span className="font-semibold">{reviewProgress}%</span>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-charcoal/40">
          <div className="h-full rounded-full bg-cream transition-[width]" style={{ width: `${reviewProgress}%` }} />
        </div>
        <p className="mt-4 text-sm text-cream/75">
          {stats.awaitingReview > 0
            ? `${stats.awaitingReview} kandidatë presin përgjigje nga ju.`
            : 'Të gjitha aplikimet janë shqyrtuar. Punë e mirë!'}
        </p>
      </section>

      <div className="mt-9 grid gap-8 xl:grid-cols-2">
        <section aria-labelledby="pozitat-titull">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-cream/50 uppercase">Manage Internships</p>
              <h2 id="pozitat-titull" className="mt-2 font-display text-3xl text-cream">Pozitat tuaja</h2>
            </div>
            <Link to="/kompani/pozitat" className="inline-flex items-center gap-2 text-sm font-semibold text-cream/75 hover:text-cream">
              Menaxho <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-cream/15 bg-cream text-charcoal">
            {positions.slice(0, 4).map((position, index) => (
              <article key={position.id} className={`flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5 ${index ? 'border-t border-charcoal/10' : ''}`}>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{position.title}</h3>
                  <p className="mt-0.5 text-sm text-charcoal/60">
                    {position.applicationCount} aplikime · {position.acceptedCount}/{position.seats} vende të plotësuara
                  </p>
                </div>
                <StatusBadge status={position.status} />
              </article>
            ))}
            {positions.length === 0 && (
              <div className="p-6 text-center">
                <CircleDashed aria-hidden="true" className="mx-auto size-7 text-charcoal/50" />
                <p className="mt-2 text-charcoal/70">Ende nuk keni publikuar asnjë pozitë.</p>
                <Link to="/kompani/pozitat/e-re" className="mt-3 inline-block font-semibold underline underline-offset-4">
                  Publiko pozitën e parë
                </Link>
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="aplikimet-titull">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-cream/50 uppercase">Përditësimet e fundit</p>
              <h2 id="aplikimet-titull" className="mt-2 font-display text-3xl text-cream">Aplikimet e fundit</h2>
            </div>
            <Link to="/kompani/aplikimet" className="inline-flex items-center gap-2 text-sm font-semibold text-cream/75 hover:text-cream">
              Shiko të gjitha <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-cream/15 bg-charcoal/55">
            {recentApplications.map((application, index) => (
              <article key={application.id} className={`flex flex-wrap items-center justify-between gap-4 p-4 sm:px-5 ${index ? 'border-t border-cream/10' : ''}`}>
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cream/10 text-cream">
                    <FileText aria-hidden="true" className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-cream">{application.student.name}</h3>
                    <p className="mt-0.5 truncate text-sm text-cream/55">{application.positionTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden items-center gap-1.5 text-xs text-cream/55 sm:flex">
                    <CalendarDays aria-hidden="true" className="size-3.5" />
                    {formatDay(application.submittedAt)}
                  </span>
                  <CandidateStatusBadge status={application.status} tone="dark" />
                </div>
              </article>
            ))}
            {recentApplications.length === 0 && (
              <div className="p-6 text-center text-cream/65">
                <CircleDashed aria-hidden="true" className="mx-auto size-7" />
                <p className="mt-2">Aplikimet e studentëve do të shfaqen këtu.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
