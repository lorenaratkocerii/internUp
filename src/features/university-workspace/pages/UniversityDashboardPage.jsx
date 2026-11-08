import { ArrowRight, ArrowUpRight, CircleCheck, CircleDashed, MailWarning } from 'lucide-react';
import { Link } from 'react-router';
import { VerificationStatus } from '../../../domain/university/studentVerification';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { formatDay } from '../../company-workspace/utils/format';
import { WorkspaceError, WorkspaceLoading } from '../../company-workspace/components/WorkspaceStatus';
import { UniversityWorkspace } from '../components/UniversityWorkspace';
import { useUniversityOverview } from '../hooks/useUniversityOverview';

const RECENT_LIMIT = 4;

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-cream/15 bg-charcoal/55 p-5 text-cream">
      <p className="font-display text-4xl">{value}</p>
      <p className="mt-1 text-sm font-semibold">{label}</p>
      {hint && <p className="mt-1 text-xs text-cream/55">{hint}</p>}
    </div>
  );
}

export function UniversityDashboardPage({ useCases }) {
  useDocumentTitle('Paneli i universitetit');
  const { status, data, error } = useUniversityOverview(useCases);

  const pending = data?.requests.filter((request) => request.status === VerificationStatus.PENDING) ?? [];
  const verified = data?.requests.filter((request) => request.status === VerificationStatus.VERIFIED) ?? [];
  const programs = Object.entries(
    verified.reduce((acc, request) => ({ ...acc, [request.program]: (acc[request.program] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]);
  const maxProgram = programs[0]?.[1] ?? 1;

  return (
    <UniversityWorkspace title="Paneli kryesor" university={data?.university} pendingCount={data?.counts.pending}>
      {status === 'loading' && !data && <WorkspaceLoading />}
      {status === 'error' && <WorkspaceError error={error} />}

      {data && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-cream/55">{new Intl.DateTimeFormat('sq-AL', { dateStyle: 'full' }).format(new Date())}</p>
              <h2 className="mt-2 font-display text-4xl text-cream">{data.university.shortName}</h2>
              <p className="mt-2 max-w-2xl text-cream/65">
                {data.counts.pending
                  ? `${data.counts.pending} ${data.counts.pending === 1 ? 'student pret' : 'studentë presin'} që t'i verifikosh.`
                  : 'Nuk ka kërkesa në pritje. Të gjithë studentët janë shqyrtuar.'}
              </p>
            </div>
            <Link
              to={`/universitetet/${data.university.id}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-cream/25 px-4 py-2.5 font-semibold text-cream hover:bg-cream/10"
            >
              Shiko profilin publik <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <section aria-label="Përmbledhje" className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Stat label="Në pritje" value={data.counts.pending} hint="Kërkesa për t'u shqyrtuar" />
            <Stat label="Të verifikuar" value={data.counts.verified} hint="Studentë aktivë në InternUp" />
            <Stat label="Në praktikë" value={data.counts.inInternship} hint="Me të paktën një pranim" />
            <Stat label="Aplikime" value={data.counts.applications} hint="Nga studentët e verifikuar" />
          </section>

          <div className="mt-9 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
            <section aria-labelledby="kerkesat-titull">
              <div className="flex items-end justify-between gap-3">
                <h2 id="kerkesat-titull" className="font-display text-3xl text-cream">Kërkesat e reja</h2>
                <Link to="/universitet/verifikimi" className="inline-flex items-center gap-2 text-sm font-semibold text-cream/75 hover:text-cream">
                  Të gjitha <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-cream/15 bg-charcoal/55">
                {pending.slice(0, RECENT_LIMIT).map((request, index) => (
                  <article key={request.id} className={`flex items-center justify-between gap-4 p-4 sm:px-5 ${index ? 'border-t border-cream/10' : ''}`}>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-cream">{request.student.name}</h3>
                      <p className="mt-0.5 truncate text-sm text-cream/55">
                        {request.program} · {request.studyYear}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-xs text-cream/55">
                      {request.emailMatches ? (
                        <CircleCheck aria-label="Email-i universitar përputhet" className="size-4 text-cream/80" />
                      ) : (
                        <MailWarning aria-label="Email-i nuk është i universitetit" className="size-4 text-cream" />
                      )}
                      <span className="hidden sm:inline">{formatDay(request.submittedAt)}</span>
                    </div>
                  </article>
                ))}
                {pending.length === 0 && (
                  <div className="p-6 text-center text-cream/65">
                    <CircleDashed aria-hidden="true" className="mx-auto size-7" />
                    <p className="mt-2">Kërkesat e reja do të shfaqen këtu.</p>
                  </div>
                )}
              </div>
            </section>

            <section aria-labelledby="drejtimet-titull" className="rounded-2xl border border-cream/15 bg-cream p-5 text-charcoal sm:p-6">
              <h2 id="drejtimet-titull" className="font-display text-2xl">Drejtimet e studentëve</h2>
              <p className="mt-1 text-sm text-charcoal/60">Vetëm studentët e verifikuar.</p>
              {programs.length ? (
                <ul className="mt-5 space-y-3.5">
                  {programs.map(([program, count]) => (
                    <li key={program}>
                      <div className="flex justify-between gap-3 text-sm">
                        <span className="truncate font-medium">{program}</span>
                        <span className="text-charcoal/60">{count}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 bg-charcoal/10">
                        <div className="h-full bg-navy" style={{ width: `${(count / maxProgram) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-sm text-charcoal/65">Ende pa studentë të verifikuar.</p>
              )}
            </section>
          </div>
        </>
      )}
    </UniversityWorkspace>
  );
}
