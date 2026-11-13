import { Link } from 'react-router';
import { isPendingRepresentative } from '../../../domain/auth/accessControl';
import { VerificationStatus } from '../../../domain/university/studentVerification';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { formatDay } from '../../company-workspace/utils/format';
import { WorkspaceError, WorkspaceLoading } from '../../company-workspace/components/WorkspaceStatus';
import { UniversityWorkspace } from '../components/UniversityWorkspace';
import { useUniversityOverview } from '../hooks/useUniversityOverview';

const RECENT_LIMIT = 4;

function pendingSentence(count) {
  if (count === 0) return 'Nuk ka kërkesa në pritje.';
  return count === 1 ? '1 student pret përgjigjen tënde.' : `${count} studentë presin përgjigjen tënde.`;
}

export function UniversityDashboardPage({ useCases }) {
  useDocumentTitle('Paneli i universitetit');
  const { actor, status, data, error } = useUniversityOverview(useCases);
  const awaitingConfirmation = isPendingRepresentative(actor);

  const pending = data?.requests.filter((request) => request.status === VerificationStatus.PENDING) ?? [];
  const verified = data?.requests.filter((request) => request.status === VerificationStatus.VERIFIED) ?? [];
  const programs = Object.entries(
    verified.reduce((acc, request) => ({ ...acc, [request.program]: (acc[request.program] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'sq'));

  const figures = data
    ? [
        { label: 'Në pritje', value: data.counts.pending },
        { label: 'Të verifikuar', value: data.counts.verified },
        { label: 'Aplikime të tyre', value: data.counts.applications },
        { label: 'Të pranuar në praktikë', value: data.counts.accepted },
      ]
    : [];

  return (
    <UniversityWorkspace title="Paneli kryesor" university={data?.university} pendingCount={data?.counts.pending}>
      {status === 'loading' && !data && <WorkspaceLoading />}
      {status === 'error' && <WorkspaceError error={error} />}

      {data && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl text-cream">{data.university.shortName}</h2>
              {!awaitingConfirmation && <p className="mt-2 text-cream/70">{pendingSentence(data.counts.pending)}</p>}
            </div>
            <Link
              to={`/universitetet/${data.university.id}`}
              className="font-semibold text-cream underline decoration-cream/35 underline-offset-[6px] hover:decoration-cream"
            >
              Shiko faqen publike
            </Link>
          </div>

          {!awaitingConfirmation && (
            <>
              <dl className="mt-8 grid grid-cols-2 border-y border-cream/15 sm:grid-cols-4">
                {figures.map((figure, index) => (
                  <div
                    key={figure.label}
                    className={`py-5 pr-4 ${index % 2 ? 'pl-5' : ''} ${index ? 'sm:border-l sm:border-cream/15 sm:pl-5' : ''}`}
                  >
                    <dd className="font-display text-4xl text-cream tabular-nums">{figure.value}</dd>
                    <dt className="mt-1 text-sm text-cream/65">{figure.label}</dt>
                  </div>
                ))}
              </dl>

              <div className="mt-10 grid gap-10 xl:grid-cols-[1.3fr_1fr]">
                <section aria-labelledby="kerkesat-titull">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 id="kerkesat-titull" className="font-display text-2xl text-cream">
                      Kërkesat në pritje
                    </h2>
                    {pending.length > RECENT_LIMIT && (
                      <Link
                        to="/universitet/verifikimi"
                        className="text-sm font-semibold text-cream/75 underline underline-offset-4 hover:text-cream"
                      >
                        Shiko të {pending.length}
                      </Link>
                    )}
                  </div>

                  {pending.length === 0 ? (
                    <p className="mt-4 border-t border-cream/15 pt-4 text-cream/65">
                      Kur një student kërkon verifikim te {data.university.shortName}, e gjen këtu.
                    </p>
                  ) : (
                    <ul className="mt-4 border-t border-cream/15">
                      {pending.slice(0, RECENT_LIMIT).map((request) => (
                        <li key={request.id} className="border-b border-cream/15">
                          <Link
                            to="/universitet/verifikimi"
                            className="flex items-baseline justify-between gap-4 py-3.5 hover:bg-cream/5"
                          >
                            <span className="min-w-0">
                              <span className="block truncate font-semibold text-cream">{request.student.name}</span>
                              <span className="block truncate text-sm text-cream/60">
                                {request.program}, {request.studyYear.toLowerCase()}
                              </span>
                            </span>
                            <span className="shrink-0 text-right text-sm text-cream/60">
                              {formatDay(request.submittedAt)}
                              {!request.emailMatches && <span className="block text-terracotta">email jo universitar</span>}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section aria-labelledby="drejtimet-titull">
                  <h2 id="drejtimet-titull" className="font-display text-2xl text-cream">
                    Studentët sipas drejtimit
                  </h2>
                  {programs.length ? (
                    <ul className="mt-4 border-t border-cream/15">
                      {programs.map(([program, count]) => (
                        <li key={program} className="flex justify-between gap-4 border-b border-cream/15 py-3 text-sm">
                          <span className="text-cream/85">{program}</span>
                          <span className="text-cream tabular-nums">{count}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 border-t border-cream/15 pt-4 text-cream/65">Ende pa studentë të verifikuar.</p>
                  )}
                </section>
              </div>
            </>
          )}
        </>
      )}
    </UniversityWorkspace>
  );
}
