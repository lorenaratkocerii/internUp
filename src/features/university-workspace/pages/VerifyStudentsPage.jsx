import { useState } from 'react';
import { BadgeCheck, CircleAlert, CircleCheck, Hash, Mail, ShieldCheck } from 'lucide-react';
import { isPendingRepresentative } from '../../../domain/auth/accessControl';
import { VerificationStatus } from '../../../domain/university/studentVerification';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { Flash, WorkspaceError, WorkspaceLoading } from '../../company-workspace/components/WorkspaceStatus';
import { formatDay } from '../../company-workspace/utils/format';
import { DecisionDialog } from '../components/DecisionDialog';
import { UniversityWorkspace } from '../components/UniversityWorkspace';
import { VerificationBadge } from '../components/VerificationBadge';
import { useUniversityOverview } from '../hooks/useUniversityOverview';

const TABS = [
  { id: VerificationStatus.PENDING, label: 'Në pritje' },
  { id: VerificationStatus.VERIFIED, label: 'Të verifikuar' },
  { id: VerificationStatus.REJECTED, label: 'Të refuzuar' },
];

const DIALOGS = {
  verify: (request) => ({
    status: VerificationStatus.VERIFIED,
    title: `Ta verifikosh ${request.student.name}?`,
    description: `Duke verifikuar, konfirmon që ${request.student.name} studion "${request.program}" me indeksin ${request.studentNumber}. Studenti do të shfaqet në listën publike të universitetit.`,
    confirmLabel: 'Po, verifiko',
    tone: 'success',
  }),
  reject: (request) => ({
    status: VerificationStatus.REJECTED,
    title: `Ta refuzosh kërkesën e ${request.student.name}?`,
    description: 'Studenti mund ta rregullojë kërkesën dhe ta dërgojë sërish.',
    confirmLabel: 'Refuzo kërkesën',
    tone: 'danger',
    needsNote: true,
  }),
  revoke: (request) => ({
    status: VerificationStatus.REJECTED,
    title: `Ta heqësh verifikimin e ${request.student.name}?`,
    description: 'Studenti do të hiqet nga lista publike e universitetit.',
    confirmLabel: 'Hiq verifikimin',
    tone: 'danger',
    needsNote: true,
  }),
};

function Detail({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-2">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-charcoal/50" />
      <div className="min-w-0">
        <p className="text-xs text-charcoal/55">{label}</p>
        <p className="text-sm font-medium break-words">{children}</p>
      </div>
    </div>
  );
}

function RequestCard({ request, onAction, readOnly }) {
  return (
    <article className="rounded-2xl border border-cream/15 bg-cream p-5 text-charcoal shadow-lg sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-2xl">{request.student.name}</h3>
          <p className="mt-0.5 text-sm text-charcoal/65">
            {request.faculty} · {request.program} · {request.studyYear}
          </p>
        </div>
        <VerificationBadge status={request.status} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Detail icon={Hash} label="Numri i indeksit">{request.studentNumber}</Detail>
        <Detail icon={Mail} label="Email-i universitar">{request.universityEmail}</Detail>
      </div>

      {request.status === VerificationStatus.PENDING && (
        <p
          className={`mt-4 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm ${
            request.emailMatches ? 'bg-olive/15 text-olive' : 'bg-terracotta/10 text-terracotta'
          }`}
        >
          {request.emailMatches ? (
            <>
              <CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              Email-i është në domenin e universitetit. Kontrollo edhe numrin e indeksit para se ta verifikosh.
            </>
          ) : (
            <>
              <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              Email-i nuk është në domenin e universitetit. Verifikoje vetëm nëse e gjen studentin në regjistër.
            </>
          )}
        </p>
      )}

      {request.status === VerificationStatus.REJECTED && request.note && (
        <p className="mt-4 rounded-xl bg-charcoal/5 px-3 py-2.5 text-sm text-charcoal/75">
          <span className="font-semibold text-charcoal">Arsyeja: </span>
          {request.note}
        </p>
      )}

      {request.status === VerificationStatus.VERIFIED && (
        <p className="mt-4 text-sm text-charcoal/65">
          {request.applicationCount === 0
            ? 'Ende nuk ka aplikuar për praktika.'
            : `${request.applicationCount} aplikime në InternUp${request.acceptedCount ? `, ${request.acceptedCount} të pranuara` : ''}.`}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-charcoal/10 pt-4">
        <span className="text-sm text-charcoal/55">
          {request.status === VerificationStatus.PENDING
            ? `Dërguar më ${formatDay(request.submittedAt)}`
            : `Vendosur më ${formatDay(request.decidedAt)}`}
        </span>
        {readOnly ? (
          <span className="ml-auto text-sm text-charcoal/55">Aktivizohet pasi të konfirmohet llogaria.</span>
        ) : (
          <div className="ml-auto flex flex-wrap gap-2">
            {request.status === VerificationStatus.PENDING && (
              <>
                <button
                  type="button"
                  onClick={() => onAction('reject', request)}
                  className="inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold text-burgundy hover:bg-burgundy/10"
                >
                  Refuzo
                </button>
                <button
                  type="button"
                  onClick={() => onAction('verify', request)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-olive px-4 text-sm font-semibold text-cream hover:bg-olive/90"
                >
                  <BadgeCheck aria-hidden="true" className="size-4" /> Verifiko
                </button>
              </>
            )}
            {request.status === VerificationStatus.VERIFIED && (
              <button
                type="button"
                onClick={() => onAction('revoke', request)}
                className="inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold text-burgundy hover:bg-burgundy/10"
              >
                Hiq verifikimin
              </button>
            )}
            {request.status === VerificationStatus.REJECTED && (
              <button
                type="button"
                onClick={() => onAction('verify', request)}
                className="inline-flex min-h-10 items-center rounded-lg border border-charcoal/20 px-4 text-sm font-semibold hover:bg-charcoal/5"
              >
                Verifiko gjithsesi
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function VerifyStudentsPage({ useCases }) {
  useDocumentTitle('Verifikimi i studentëve');
  const { actor, status, data, error, reload } = useUniversityOverview(useCases);

  const [tab, setTab] = useState(VerificationStatus.PENDING);
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const [dialogError, setDialogError] = useState('');
  const [flash, setFlash] = useState(null);

  const readOnly = isPendingRepresentative(actor);
  const requests = data?.requests ?? [];
  const visible = requests.filter((request) => request.status === tab);

  const openDialog = (kind, request) => {
    setDialogError('');
    setPending({ request, ...DIALOGS[kind](request) });
  };

  const apply = async (note) => {
    setBusy(true);
    setDialogError('');
    try {
      const updated = await useCases.decide(actor, pending.request.id, { status: pending.status, note });
      await reload();
      setFlash({
        message:
          updated.status === VerificationStatus.VERIFIED
            ? `${updated.student.name} u verifikua dhe tani shfaqet si student i ${data.university.shortName}.`
            : `Kërkesa e ${updated.student.name} u refuzua. Studenti e sheh arsyen në panelin e vet.`,
      });
      setPending(null);
    } catch (applyError) {
      setDialogError(applyError.fieldErrors?.note ?? applyError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <UniversityWorkspace title="Verifikimi" university={data?.university} pendingCount={data?.counts.pending}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl text-cream">Verifiko studentët</h2>
          <p className="mt-2 max-w-2xl text-cream/65">
            Konfirmo që këta studentë studiojnë te {data?.university.shortName ?? 'universiteti juaj'}. Vetëm studentët e
            verifikuar shfaqen në listën publike dhe te kompanitë.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-xl border border-cream/15 bg-charcoal/60 px-4 py-3 text-sm text-cream/75">
          <ShieldCheck aria-hidden="true" className="size-4" />
          {data?.counts.pending ?? 0} në pritje
        </span>
      </div>
      <Flash message={flash?.message} tone={flash?.tone} />

      {status === 'loading' && !data && <WorkspaceLoading />}
      {status === 'error' && <WorkspaceError error={error} />}

      {data && (
        <>
          <div role="tablist" aria-label="Filtro kërkesat" className="mt-6 flex flex-wrap gap-2">
            {TABS.map((item) => (
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
                {item.label} ({requests.filter((request) => request.status === item.id).length})
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {visible.map((request) => (
              <RequestCard key={request.id} request={request} onAction={openDialog} readOnly={readOnly} />
            ))}
            {visible.length === 0 && (
              <div className="rounded-2xl border border-dashed border-cream/20 bg-charcoal/30 px-6 py-12 text-center text-cream">
                <ShieldCheck aria-hidden="true" className="mx-auto size-7 text-cream/55" />
                <h3 className="mt-4 font-display text-2xl">
                  {tab === VerificationStatus.PENDING ? 'Nuk ka kërkesa në pritje' : 'Asgjë në këtë grup'}
                </h3>
                <p className="mt-2 text-sm text-cream/60">
                  Kur një student zgjedh universitetin tuaj dhe kërkon verifikim, kërkesa shfaqet këtu.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {pending && (
        <DecisionDialog
          key={pending.request.id + pending.status}
          title={pending.title}
          description={pending.description}
          confirmLabel={pending.confirmLabel}
          tone={pending.tone}
          needsNote={pending.needsNote}
          busy={busy}
          error={dialogError}
          onConfirm={apply}
          onCancel={() => setPending(null)}
        />
      )}
    </UniversityWorkspace>
  );
}
