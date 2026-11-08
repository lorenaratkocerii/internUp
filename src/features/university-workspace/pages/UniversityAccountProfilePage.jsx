import { useCallback, useState } from 'react';
import { Save } from 'lucide-react';
import { isPendingRepresentative } from '../../../domain/auth/accessControl';
import { UNIVERSITY_TYPE_LABELS } from '../../../domain/university/University';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { describedBy, Field, inputClass, SectionCard } from '../../company-workspace/components/FormControls';
import { Flash, WorkspaceError, WorkspaceLoading } from '../../company-workspace/components/WorkspaceStatus';
import { useWorkspaceData } from '../../company-workspace/hooks/useWorkspaceData';
import { UniversityWorkspace } from '../components/UniversityWorkspace';

const toDraft = (university) => ({
  description: university.description,
  website: university.website,
  emailDomains: university.emailDomains.join(', '),
  representativeName: university.representative?.name ?? '',
  representativeTitle: university.representative?.title ?? '',
  representativeEmail: university.representative?.email ?? '',
});

function ProfileForm({ university, useCases, actor, onSaved }) {
  const readOnly = isPendingRepresentative(actor);
  const [draft, setDraft] = useState(() => toDraft(university));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(null);

  const bind = (name) => ({
    id: `universiteti-${name}`,
    name,
    value: draft[name],
    onChange: (event) => {
      setDraft((current) => ({ ...current, [name]: event.target.value }));
      setErrors((current) => ({ ...current, [name]: undefined }));
    },
    'aria-invalid': Boolean(errors[name]),
  });

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setFlash(null);
    try {
      await useCases.updateMyUniversity(actor, draft);
      setErrors({});
      setFlash({ message: 'Profili u ruajt. Ndryshimet duken menjëherë në faqen publike.' });
      onSaved();
    } catch (saveError) {
      setErrors(saveError.fieldErrors ?? {});
      setFlash({ message: saveError.message, tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} noValidate className="mt-6 space-y-5">
      <fieldset disabled={readOnly} className="space-y-5 disabled:opacity-80">
      <SectionCard number="01" title="Universiteti" description="Emri, lloji dhe qyteti menaxhohen nga InternUp.">
        <dl className="mb-6 grid gap-4 rounded-xl bg-charcoal/5 p-4 text-sm sm:grid-cols-3">
          <div><dt className="text-xs text-charcoal/55">Emri</dt><dd className="mt-0.5 font-semibold">{university.name}</dd></div>
          <div><dt className="text-xs text-charcoal/55">Lloji</dt><dd className="mt-0.5 font-semibold">{UNIVERSITY_TYPE_LABELS[university.type]}</dd></div>
          <div><dt className="text-xs text-charcoal/55">Qyteti</dt><dd className="mt-0.5 font-semibold">{university.city}</dd></div>
        </dl>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="universiteti-description" label="Përshkrimi" required wide error={errors.description} hint="Shfaqet te “Rreth universitetit” në profilin publik.">
            <textarea rows={4} {...bind('description')} aria-describedby={describedBy('universiteti-description', { error: errors.description, hint: true })} className={`${inputClass} resize-y`} />
          </Field>
          <Field id="universiteti-website" label="Website" error={errors.website}>
            <input type="url" placeholder="https://" {...bind('website')} aria-describedby={describedBy('universiteti-website', { error: errors.website })} className={inputClass} />
          </Field>
          <Field id="universiteti-emailDomains" label="Domenet e email-it" error={errors.emailDomains} hint="Kërkesat nga këto domene shënohen si të përputhura.">
            <input placeholder="uni-pr.edu, student.uni-pr.edu" {...bind('emailDomains')} aria-describedby={describedBy('universiteti-emailDomains', { error: errors.emailDomains, hint: true })} className={inputClass} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard number="02" title="Përfaqësuesi" description="Personi që shqyrton kërkesat dhe që shfaqet në profilin publik.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="universiteti-representativeName" label="Emri dhe mbiemri" required error={errors.representativeName}>
            <input {...bind('representativeName')} autoComplete="name" className={inputClass} />
          </Field>
          <Field id="universiteti-representativeTitle" label="Roli" required error={errors.representativeTitle}>
            <input placeholder="p.sh. Zyra për Karrierë" {...bind('representativeTitle')} className={inputClass} />
          </Field>
          <Field id="universiteti-representativeEmail" label="Email-i i kontaktit" required wide error={errors.representativeEmail}>
            <input type="email" {...bind('representativeEmail')} autoComplete="email" className={inputClass} />
          </Field>
        </div>
      </SectionCard>
      </fieldset>

      <Flash message={flash?.message} tone={flash?.tone} />
      <div className="flex flex-wrap items-center justify-end gap-4">
        {readOnly && <p className="text-sm text-cream/65">Profili mund të ndryshohet pasi të konfirmohet llogaria.</p>}
        <button
          type="submit"
          disabled={busy || readOnly}
          className={`inline-flex min-h-11 items-center gap-2 rounded-lg bg-cream px-5 py-2.5 font-semibold text-charcoal hover:bg-cream/90 disabled:opacity-60 ${
            readOnly ? 'disabled:cursor-not-allowed' : 'disabled:cursor-wait'
          }`}
        >
          <Save aria-hidden="true" className="size-4" />
          {busy ? 'Po ruhet…' : 'Ruaj profilin'}
        </button>
      </div>
    </form>
  );
}

export function UniversityAccountProfilePage({ useCases }) {
  useDocumentTitle('Profili i universitetit');
  const actor = useCurrentActor();
  const load = useCallback(() => useCases.getOverview(actor), [useCases, actor]);
  const { status, data, error, reload } = useWorkspaceData(load);

  return (
    <UniversityWorkspace title="Profili" university={data?.university} pendingCount={data?.counts.pending}>
      <h2 className="font-display text-4xl text-cream">Profili i universitetit</h2>
      <p className="mt-2 max-w-2xl text-cream/65">Këto të dhëna i shohin studentët dhe kompanitë në faqen e universitetit.</p>

      {status === 'loading' && !data && <WorkspaceLoading />}
      {status === 'error' && <WorkspaceError error={error} />}
      {data && <ProfileForm key={data.university.id} university={data.university} useCases={useCases} actor={actor} onSaved={reload} />}
    </UniversityWorkspace>
  );
}
