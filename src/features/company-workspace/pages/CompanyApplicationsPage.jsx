import { CalendarDays, FileText, GraduationCap, Mail, MapPin, Search, UserRound, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  allowedTransitions,
  CANDIDATE_STATUS_LABELS,
  CANDIDATE_STATUSES,
  CandidateStatus,
} from '../../../domain/internship/candidateApplication';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { CandidateStatusBadge } from '../../applications/components/CandidateStatusBadge';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { CompanyWorkspace } from '../components/CompanyWorkspace';
import { ConfirmDialog } from '../components/FormControls';
import { Flash, WorkspaceError, WorkspaceLoading } from '../components/WorkspaceStatus';
import { useWorkspaceData } from '../hooks/useWorkspaceData';
import { formatDay } from '../utils/format';

const ACTION_LABELS = {
  [CandidateStatus.UNDER_REVIEW]: 'Shëno në shqyrtim',
  [CandidateStatus.SHORTLISTED]: 'Listë e ngushtë',
  [CandidateStatus.ACCEPTED]: 'Prano intern',
  [CandidateStatus.REJECTED]: 'Refuzo',
};

const ACTION_STYLES = {
  [CandidateStatus.UNDER_REVIEW]: 'border border-charcoal/20 hover:bg-charcoal/5',
  [CandidateStatus.SHORTLISTED]: 'border border-terracotta/40 text-terracotta hover:bg-terracotta/10',
  [CandidateStatus.ACCEPTED]: 'bg-olive text-cream hover:bg-olive/90',
  [CandidateStatus.REJECTED]: 'text-burgundy hover:bg-burgundy/10',
};

const NEEDS_CONFIRMATION = [CandidateStatus.ACCEPTED, CandidateStatus.REJECTED];

function StatusActions({ application, onChange, busy }) {
  const actions = allowedTransitions(application.status);
  if (!actions.length) {
    return <p className="text-sm text-charcoal/60">Vendim përfundimtar — studenti është njoftuar te paneli i tij.</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((status) => (
        <button
          key={status}
          type="button"
          disabled={busy}
          onClick={() => onChange(application, status)}
          className={`inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 ${ACTION_STYLES[status]}`}
        >
          {ACTION_LABELS[status]}
        </button>
      ))}
    </div>
  );
}

export function CompanyApplicationsPage({ useCases }) {
  useDocumentTitle('Aplikimet e kandidatëve');
  const actor = useCurrentActor();
  const [searchParams, setSearchParams] = useSearchParams();
  const load = useCallback(async () => {
    const [company, applications, positions] = await Promise.all([
      useCases.getMyCompany(actor),
      useCases.listApplications(actor),
      useCases.listMyInternships(actor),
    ]);
    return { company, applications, positions };
  }, [useCases, actor]);
  const { status, data, error, reload } = useWorkspaceData(load);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const positionFilter = searchParams.get('pozita') ?? '';
  const [selectedId, setSelectedId] = useState(null);
  const [pendingChange, setPendingChange] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [flash, setFlash] = useState(null);

  const applications = useMemo(() => data?.applications ?? [], [data]);
  const selected = applications.find((application) => application.id === selectedId) ?? null;

  const positionOptions = useMemo(() => {
    const titles = new Map(applications.map((application) => [application.internshipId, application.positionTitle]));
    for (const position of data?.positions ?? []) titles.set(position.id, position.title);
    return [...titles.entries()].map(([id, title]) => ({ id, title })).sort((a, b) => a.title.localeCompare(b.title, 'sq'));
  }, [applications, data]);

  const visible = applications.filter((application) => {
    const haystack = `${application.student.name} ${application.student.university} ${application.student.major} ${application.positionTitle}`.toLowerCase();
    return (
      haystack.includes(query.trim().toLowerCase()) &&
      (!statusFilter || application.status === statusFilter) &&
      (!positionFilter || application.internshipId === positionFilter)
    );
  });
  const counts = Object.fromEntries(CANDIDATE_STATUSES.map((item) => [item, applications.filter((application) => application.status === item).length]));

  useEffect(() => {
    if (!selected) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape' && !pendingChange) setSelectedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, pendingChange]);

  const applyChange = async (application, nextStatus) => {
    setBusyId(application.id);
    try {
      await useCases.updateApplicationStatus(actor, application.id, nextStatus);
      await reload();
      setFlash({
        message:
          nextStatus === CandidateStatus.ACCEPTED
            ? `${application.student.name} u pranua si intern për "${application.positionTitle}".`
            : `Statusi i ${application.student.name} u ndryshua në "${CANDIDATE_STATUS_LABELS[nextStatus]}".`,
      });
    } catch (changeError) {
      setFlash({ message: changeError.message, tone: 'error' });
    } finally {
      setBusyId(null);
      setPendingChange(null);
    }
  };

  const requestChange = (application, nextStatus) => {
    if (NEEDS_CONFIRMATION.includes(nextStatus)) setPendingChange({ application, status: nextStatus });
    else applyChange(application, nextStatus);
  };

  const setPositionFilter = (value) =>
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set('pozita', value);
      else next.delete('pozita');
      return next;
    }, { replace: true });

  const clearFilters = () => {
    setQuery('');
    setStatusFilter('');
    setPositionFilter('');
  };

  return (
    <CompanyWorkspace title="Aplikimet" subtitle="Aplikimet e kandidatëve" companyName={data?.company.name}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-cream/50 uppercase">Kandidatët</p>
          <h2 className="mt-2 font-display text-4xl text-cream">Aplikimet e studentëve</h2>
          <p className="mt-2 text-cream/65">Shqyrtoni kandidatët, vendosini në listën e ngushtë dhe pranoni interns.</p>
        </div>
        <span className="rounded-xl border border-cream/15 bg-charcoal/60 px-4 py-3 text-sm text-cream/75">{applications.length} gjithsej</span>
      </div>
      <Flash message={flash?.message} tone={flash?.tone} />

      {status === 'loading' && !data && <WorkspaceLoading />}
      {status === 'error' && <WorkspaceError error={error} />}

      {data && (
        <>
          <div role="group" aria-label="Filtro sipas statusit" className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {CANDIDATE_STATUSES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatusFilter(statusFilter === item ? '' : item)}
                aria-pressed={statusFilter === item}
                className={`rounded-xl p-3 text-left transition-colors ${statusFilter === item ? 'bg-cream text-charcoal' : 'bg-cream/5 text-cream hover:bg-cream/10'}`}
              >
                <span className="block font-display text-2xl tabular-nums">{counts[item]}</span>
                <span className="mt-0.5 block text-xs opacity-70">{CANDIDATE_STATUS_LABELS[item]}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem_12rem]">
            <label className="relative block">
              <span className="sr-only">Kërko kandidatët</span>
              <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-cream/45" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kërko emrin, universitetin ose pozitën" className="min-h-12 w-full rounded-xl border border-cream/15 bg-charcoal/60 pr-4 pl-10 text-cream placeholder:text-cream/40" />
            </label>
            <label className="block">
              <span className="sr-only">Filtro sipas pozitës</span>
              <select value={positionFilter} onChange={(event) => setPositionFilter(event.target.value)} className="min-h-12 w-full rounded-xl border border-cream/15 bg-charcoal px-3 text-cream">
                <option value="">Të gjitha pozitat</option>
                {positionOptions.map((option) => <option key={option.id} value={option.id}>{option.title}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">Filtro sipas statusit</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="min-h-12 w-full rounded-xl border border-cream/15 bg-charcoal px-3 text-cream">
                <option value="">Të gjitha statuset</option>
                {CANDIDATE_STATUSES.map((item) => <option key={item} value={item}>{CANDIDATE_STATUS_LABELS[item]}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-5 space-y-3">
            {visible.map((application) => (
              <article key={application.id} className="rounded-2xl border border-cream/15 bg-cream p-5 text-charcoal shadow-lg sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy text-cream">
                      <UserRound aria-hidden="true" className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-xl sm:text-2xl">{application.student.name}</h3>
                      <p className="mt-0.5 text-sm text-charcoal/65">
                        {[application.student.major, application.student.university].filter(Boolean).join(' · ')}
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {application.positionTitle}
                        {!application.positionExists && <span className="ml-2 font-normal text-charcoal/55">(pozita është fshirë)</span>}
                      </p>
                    </div>
                  </div>
                  <CandidateStatusBadge status={application.status} />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-charcoal/10 pt-4">
                  <span className="inline-flex items-center gap-2 text-sm text-charcoal/60">
                    <CalendarDays aria-hidden="true" className="size-4" /> Aplikuar më {formatDay(application.submittedAt)}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => setSelectedId(application.id)} className="min-h-10 rounded-lg border border-charcoal/20 px-4 text-sm font-semibold hover:bg-charcoal/5">
                      Shiko kandidatin
                    </button>
                    <StatusActions application={application} onChange={requestChange} busy={busyId === application.id} />
                  </div>
                </div>
              </article>
            ))}

            {visible.length === 0 && (
              <div className="rounded-2xl border border-dashed border-cream/20 bg-charcoal/30 px-6 py-12 text-center text-cream">
                <Search aria-hidden="true" className="mx-auto size-7 text-cream/55" />
                <h3 className="mt-4 font-display text-2xl">{applications.length ? 'Nuk u gjet asnjë aplikim' : 'Ende nuk keni aplikime'}</h3>
                <p className="mt-2 text-sm text-cream/60">
                  {applications.length ? 'Provo një kërkim tjetër ose ndrysho filtrat.' : 'Aplikimet e studentëve për pozitat tuaja do të shfaqen këtu.'}
                </p>
                {applications.length > 0 && (
                  <button type="button" onClick={clearFilters} className="mt-4 font-semibold underline underline-offset-4">Pastro filtrat</button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {selected && (
        <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-charcoal/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedId(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="kandidati-titull" className="my-5 w-full max-w-xl rounded-2xl bg-cream p-6 text-charcoal shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-charcoal/55 uppercase">Kandidati</p>
                <h3 id="kandidati-titull" className="mt-2 font-display text-3xl">{selected.student.name}</h3>
                <p className="mt-1 font-semibold text-charcoal/65">{selected.positionTitle}</p>
              </div>
              <button type="button" onClick={() => setSelectedId(null)} aria-label="Mbyll" className="grid size-10 place-items-center rounded-full hover:bg-charcoal/10">
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 rounded-xl bg-white/45 p-4 sm:grid-cols-2">
              <div className="flex items-start gap-2"><GraduationCap aria-hidden="true" className="mt-0.5 size-4 text-terracotta" /><div><p className="text-xs text-charcoal/55">Universiteti</p><p className="font-semibold">{selected.student.university || '—'}</p><p className="text-sm text-charcoal/65">{selected.student.major}</p></div></div>
              <div className="flex items-start gap-2"><Mail aria-hidden="true" className="mt-0.5 size-4 text-terracotta" /><div className="min-w-0"><p className="text-xs text-charcoal/55">Email</p><a href={`mailto:${selected.student.email}`} className="block truncate font-semibold underline underline-offset-2">{selected.student.email}</a></div></div>
              {selected.student.city && <div className="flex items-start gap-2"><MapPin aria-hidden="true" className="mt-0.5 size-4 text-terracotta" /><div><p className="text-xs text-charcoal/55">Qyteti</p><p className="font-semibold">{selected.student.city}</p></div></div>}
              <div><p className="text-xs text-charcoal/55">Statusi aktual</p><CandidateStatusBadge status={selected.status} className="mt-1" /></div>
            </div>

            {selected.student.skills?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-charcoal/55">Aftësitë</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">{selected.student.skills.map((skill) => <li key={skill} className="rounded-full border border-charcoal/15 px-2.5 py-1 text-xs">{skill}</li>)}</ul>
              </div>
            )}
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center gap-2"><FileText aria-hidden="true" className="size-4" /><span className="font-semibold">CV:</span> {selected.cv}</p>
              {selected.coverLetter && <p className="flex items-center gap-2"><FileText aria-hidden="true" className="size-4" /><span className="font-semibold">Letër motivimi:</span> {selected.coverLetter}</p>}
            </div>
            {selected.message && (
              <div className="mt-4">
                <p className="text-xs text-charcoal/55">Mesazhi i motivimit</p>
                <p className="mt-1 leading-relaxed">{selected.message}</p>
              </div>
            )}
            <div className="mt-6 border-t border-charcoal/10 pt-5">
              <StatusActions application={selected} onChange={requestChange} busy={busyId === selected.id} />
            </div>
          </section>
        </div>
      )}

      {pendingChange && (
        <ConfirmDialog
          title={pendingChange.status === CandidateStatus.ACCEPTED ? `Ta pranosh ${pendingChange.application.student.name} si intern?` : `Ta refuzosh ${pendingChange.application.student.name}?`}
          description={
            pendingChange.status === CandidateStatus.ACCEPTED
              ? `Studenti do të shohë statusin "Pranuar" për "${pendingChange.application.positionTitle}". Ky vendim është përfundimtar dhe zë një nga vendet e lira.`
              : 'Studenti do të shohë statusin "Refuzuar". Mund ta rishqyrtoni më vonë nëse ndërroni mendje.'
          }
          confirmLabel={pendingChange.status === CandidateStatus.ACCEPTED ? 'Po, prano intern' : 'Po, refuzo'}
          tone={pendingChange.status === CandidateStatus.ACCEPTED ? 'success' : 'danger'}
          busy={busyId === pendingChange.application.id}
          onConfirm={() => applyChange(pendingChange.application, pendingChange.status)}
          onCancel={() => setPendingChange(null)}
        />
      )}
    </CompanyWorkspace>
  );
}
