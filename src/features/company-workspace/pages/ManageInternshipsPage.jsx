import { CalendarDays, ClipboardList, ExternalLink, Laptop, MapPin, Pencil, PlusCircle, Trash2, Users, Wallet } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ApplicationStatus } from '../../../domain/internship/applicationStatus';
import { StatusBadge } from '../../companies/components/StatusBadge';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { CompanyWorkspace } from '../components/CompanyWorkspace';
import { ConfirmDialog } from '../components/FormControls';
import { Flash, WorkspaceError, WorkspaceLoading } from '../components/WorkspaceStatus';
import { useWorkspaceData } from '../hooks/useWorkspaceData';
import { formatDay, WORK_MODE_LABELS } from '../utils/format';

const TABS = [
  { id: 'all', label: 'Të gjitha', test: () => true },
  { id: 'active', label: 'Aktive', test: (position) => position.status !== ApplicationStatus.CLOSED },
  { id: 'closed', label: 'Të mbyllura', test: (position) => position.status === ApplicationStatus.CLOSED },
];

export function ManageInternshipsPage({ useCases }) {
  useDocumentTitle('Manage Internships');
  const actor = useCurrentActor();
  const { state } = useLocation();
  const load = useCallback(async () => {
    const [company, positions] = await Promise.all([useCases.getMyCompany(actor), useCases.listMyInternships(actor)]);
    return { company, positions };
  }, [useCases, actor]);
  const { status, data, error, reload } = useWorkspaceData(load);

  const [tab, setTab] = useState('all');
  const [toDelete, setToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [flash, setFlash] = useState(() => (state?.flash ? { message: state.flash } : null));

  const positions = useMemo(() => data?.positions ?? [], [data]);
  const visible = positions.filter(TABS.find((item) => item.id === tab).test);

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await useCases.deleteInternship(actor, toDelete.id);
      await reload();
      setFlash({ message: `Pozita "${toDelete.title}" u fshi. Aplikimet e saj mbeten te seksioni Aplikimet.` });
    } catch (deleteError) {
      setFlash({ message: deleteError.message, tone: 'error' });
    } finally {
      setIsDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <CompanyWorkspace title="Manage Internships" subtitle="Pozitat" companyName={data?.company.name}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-cream/50 uppercase">Pozitat e praktikës</p>
          <h2 className="mt-2 font-display text-4xl text-cream">Manage Internships</h2>
          <p className="mt-2 text-cream/65">Publikoni, ndryshoni ose fshini pozitat dhe ndiqni sa vende janë plotësuar.</p>
        </div>
        <Link to="/kompani/pozitat/e-re" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cream px-4 py-2.5 font-semibold text-charcoal hover:bg-cream/90">
          <PlusCircle aria-hidden="true" className="size-4" /> Publiko pozitë
        </Link>
      </div>
      <Flash message={flash?.message} tone={flash?.tone} />

      {status === 'loading' && !data && <WorkspaceLoading />}
      {status === 'error' && <WorkspaceError error={error} />}

      {data && (
        <>
          <div role="tablist" aria-label="Filtro pozitat" className="mt-6 flex flex-wrap gap-2">
            {TABS.map((item) => {
              const count = positions.filter(item.test).length;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  onClick={() => setTab(item.id)}
                  className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${
                    tab === item.id ? 'bg-cream text-charcoal' : 'border border-cream/20 text-cream/75 hover:bg-cream/10'
                  }`}
                >
                  {item.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-3">
            {visible.map((position) => (
              <article key={position.id} className="rounded-2xl border border-cream/15 bg-cream p-5 text-charcoal shadow-lg sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl">{position.title}</h3>
                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-charcoal/65">
                      <li className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" className="size-4" />{position.location}</li>
                      <li className="inline-flex items-center gap-1.5"><Laptop aria-hidden="true" className="size-4" />{WORK_MODE_LABELS[position.workMode] ?? position.workMode}</li>
                      <li className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="size-4" />{formatDay(position.opensAt)} – {formatDay(position.closesAt)}</li>
                      <li className="inline-flex items-center gap-1.5"><Wallet aria-hidden="true" className="size-4" />{position.paid ? (position.stipend ? `${position.stipend} €/muaj` : 'Me pagesë') : 'Pa pagesë'}</li>
                    </ul>
                  </div>
                  <StatusBadge status={position.status} />
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white/50 p-3">
                    <dt className="text-xs text-charcoal/55">Aplikime</dt>
                    <dd className="mt-0.5 font-display text-2xl tabular-nums">{position.applicationCount}</dd>
                  </div>
                  <div className="rounded-xl bg-white/50 p-3">
                    <dt className="text-xs text-charcoal/55">Interns të pranuar</dt>
                    <dd className="mt-0.5 font-display text-2xl tabular-nums">{position.acceptedCount}/{position.seats}</dd>
                  </div>
                  <div className="col-span-2 rounded-xl bg-white/50 p-3 sm:col-span-1">
                    <dt className="text-xs text-charcoal/55">Kohëzgjatja</dt>
                    <dd className="mt-0.5 font-display text-2xl">{position.durationMonths} muaj</dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-charcoal/10 pt-4">
                  <Link to={`/kompani/aplikimet?pozita=${encodeURIComponent(position.id)}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-charcoal px-4 text-sm font-semibold text-cream hover:bg-navy">
                    <ClipboardList aria-hidden="true" className="size-4" /> Aplikimet
                  </Link>
                  <Link to={`/kompani/pozitat/${encodeURIComponent(position.id)}/ndrysho`} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-charcoal/20 px-4 text-sm font-semibold hover:bg-charcoal/5">
                    <Pencil aria-hidden="true" className="size-4" /> Ndrysho
                  </Link>
                  <Link to={`/kompanite/${position.companyId}/pozitat/${position.id}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-charcoal/20 px-4 text-sm font-semibold hover:bg-charcoal/5">
                    <ExternalLink aria-hidden="true" className="size-4" /> Shiko publikisht
                  </Link>
                  <button type="button" onClick={() => setToDelete(position)} className="ml-auto inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-burgundy hover:bg-burgundy/10">
                    <Trash2 aria-hidden="true" className="size-4" /> Fshi
                  </button>
                </div>
              </article>
            ))}

            {visible.length === 0 && (
              <div className="rounded-2xl border border-dashed border-cream/20 bg-charcoal/30 px-6 py-12 text-center text-cream">
                <Users aria-hidden="true" className="mx-auto size-7 text-cream/55" />
                <h3 className="mt-4 font-display text-2xl">{positions.length ? 'Asnjë pozitë në këtë grup' : 'Ende nuk keni pozita'}</h3>
                <p className="mt-2 text-sm text-cream/60">Publikoni një pozitë që studentët të mund të aplikojnë.</p>
                <Link to="/kompani/pozitat/e-re" className="mt-4 inline-block font-semibold underline underline-offset-4">Publiko pozitë</Link>
              </div>
            )}
          </div>
        </>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Ta fshij këtë pozitë?"
          description={`"${toDelete.title}" do të hiqet nga faqja publike dhe studentët nuk do të mund të aplikojnë më. ${toDelete.applicationCount ? `${toDelete.applicationCount} aplikimet ekzistuese ruhen.` : ''}`}
          confirmLabel="Po, fshije"
          busy={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </CompanyWorkspace>
  );
}
