import { useCallback, useState } from 'react';
import { BadgeCheck, Clock3, Send } from 'lucide-react';
import { Link } from 'react-router';
import { STUDY_YEARS, VerificationStatus } from '../../../domain/university/studentVerification';
import { isSameUniversity } from '../../../domain/university/University';
import { useWorkspaceData } from '../../company-workspace/hooks/useWorkspaceData';
import { formatDay } from '../../company-workspace/utils/format';
import { UniversityLogo } from '../../universities/components/UniversityLogo';
const inputClass =
  'mt-1.5 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white/70 px-3 py-2 text-sm text-charcoal outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10 aria-invalid:border-terracotta';

function Input({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">{label}</label>
      {children}
      {error && <p role="alert" className="mt-1 text-xs font-semibold text-terracotta">{error}</p>}
    </div>
  );
}
function RequestForm({ universities, profile, onSubmit, rejected }) {
  const [draft, setDraft] = useState(() => ({
    universityId:
      rejected?.universityId ?? universities.find((university) => isSameUniversity(university, profile.university))?.id ?? '',
    studentNumber: rejected?.studentNumber ?? '',
    universityEmail: rejected?.universityEmail ?? '',
    faculty: rejected?.faculty ?? profile.faculty ?? '',
    program: rejected?.program ?? profile.major ?? '',
    studyYear: rejected?.studyYear ?? (STUDY_YEARS.includes(profile.studyYear) ? profile.studyYear : ''),
  }));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const bind = (name) => ({
    id: `verifikimi-${name}`,
    value: draft[name],
    'aria-invalid': Boolean(errors[name]),
    onChange: (event) => {
      setDraft((current) => ({ ...current, [name]: event.target.value }));
      setErrors((current) => ({ ...current, [name]: undefined }));
    },
  });

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setFormError('');
    try {
      await onSubmit(draft);
    } catch (error) {
      setErrors(error.fieldErrors ?? {});
      if (!error.fieldErrors || !Object.keys(error.fieldErrors).length) setFormError(error.message);
    } finally {
      setBusy(false);
    }
  };

  const groups = [
    { label: 'Publike', items: universities.filter((university) => university.type === 'publik') },
    { label: 'Private', items: universities.filter((university) => university.type === 'privat') },
  ];

  return (
    <form onSubmit={submit} noValidate className="mt-5 grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Input id="verifikimi-universityId" label="Universiteti" error={errors.universityId}>
          <select {...bind('universityId')} className={inputClass}>
            <option value="">Zgjidh universitetin…</option>
            {groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.items.map((university) => (
                  <option key={university.id} value={university.id}>{university.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </Input>
      </div>
      <Input id="verifikimi-studentNumber" label="Numri i indeksit" error={errors.studentNumber}>
        <input {...bind('studentNumber')} inputMode="text" autoComplete="off" className={inputClass} />
      </Input>
      <Input id="verifikimi-universityEmail" label="Email-i universitar" error={errors.universityEmail}>
        <input type="email" {...bind('universityEmail')} placeholder="emri.mbiemri@uni-pr.edu" className={inputClass} />
      </Input>
      <Input id="verifikimi-faculty" label="Fakulteti" error={errors.faculty}>
        <input {...bind('faculty')} className={inputClass} />
      </Input>
      <Input id="verifikimi-program" label="Drejtimi" error={errors.program}>
        <input {...bind('program')} className={inputClass} />
      </Input>
      <Input id="verifikimi-studyYear" label="Viti i studimeve" error={errors.studyYear}>
        <select {...bind('studyYear')} className={inputClass}>
          <option value="">Zgjidh…</option>
          {STUDY_YEARS.map((year) => <option key={year}>{year}</option>)}
        </select>
      </Input>
      <div className="flex items-end sm:justify-end">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-charcoal px-5 py-2.5 text-sm font-semibold text-cream hover:bg-navy disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          <Send aria-hidden="true" className="size-4" />
          {busy ? 'Po dërgohet…' : 'Dërgo kërkesën'}
        </button>
      </div>
      {formError && <p role="alert" className="text-sm font-semibold text-terracotta sm:col-span-2">{formError}</p>}
    </form>
  );
}

export function UniversityVerificationCard({ useCases, actor, profile }) {
  const load = useCallback(async () => {
    const [verification, universities] = await Promise.all([useCases.getMyVerification(actor), useCases.listUniversities()]);
    return { verification, universities };
  }, [useCases, actor]);
  const { data, reload } = useWorkspaceData(load);
  const [retrying, setRetrying] = useState(false);

  if (!data) return null;
  const { verification, universities } = data;
  const studentName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');

  const submit = async (draft) => {
    await useCases.requestVerification(actor, { ...draft, studentName });
    setRetrying(false);
    await reload();
  };

  return (
    <section id="verifikimi" aria-labelledby="verifikimi-titull" className="mt-7 scroll-mt-24 rounded-2xl border border-cream/15 bg-cream p-5 text-charcoal shadow-lg sm:p-7">
      {verification?.status === VerificationStatus.VERIFIED && (
        <div className="flex flex-wrap items-center gap-4">
          {verification.university && <UniversityLogo university={verification.university} className="size-14 rounded-xl border border-charcoal/10" />}
          <div className="min-w-0 flex-1">
            <h2 id="verifikimi-titull" className="flex items-center gap-2 font-display text-2xl">
              <BadgeCheck aria-hidden="true" className="size-6 text-olive" />
              Student i verifikuar
            </h2>
            <p className="mt-1 text-sm text-charcoal/70">
              {verification.university?.shortName} konfirmoi më {formatDay(verification.decidedAt)} që studion {verification.program}.
            </p>
          </div>
          <Link to={`/universitetet/${verification.universityId}`} className="text-sm font-semibold underline underline-offset-4">
            Faqja e universitetit
          </Link>
        </div>
      )}

      {verification?.status === VerificationStatus.PENDING && (
        <div className="flex flex-wrap items-center gap-4">
          {verification.university && <UniversityLogo university={verification.university} className="size-14 rounded-xl border border-charcoal/10" />}
          <div className="min-w-0 flex-1">
            <h2 id="verifikimi-titull" className="flex items-center gap-2 font-display text-2xl">
              <Clock3 aria-hidden="true" className="size-5 text-terracotta" />
              Verifikimi po shqyrtohet
            </h2>
            <p className="mt-1 text-sm text-charcoal/70">
              E dërgove më {formatDay(verification.submittedAt)} te {verification.university?.shortName}. Përfaqësuesi
              {verification.university?.representative?.name ? ` (${verification.university.representative.name})` : ''} do ta kontrollojë numrin e indeksit.
            </p>
          </div>
        </div>
      )}

      {(!verification || verification.status === VerificationStatus.REJECTED) && (
        <>
          <h2 id="verifikimi-titull" className="font-display text-2xl">Verifikohu si student</h2>
          {verification ? (
            <div className="mt-2 rounded-xl bg-burgundy/10 px-4 py-3 text-sm text-burgundy">
              <p className="font-semibold">{verification.university?.shortName} e refuzoi kërkesën tënde.</p>
              <p className="mt-1">{verification.note}</p>
            </div>
          ) : (
            <p className="mt-1 max-w-2xl text-sm text-charcoal/65">
              Universiteti yt konfirmon që studion aty. Pas verifikimit shfaqesh në faqen e universitetit dhe kompanitë e dinë që
              profili yt është i vërtetë.
            </p>
          )}
          {verification && !retrying ? (
            <button
              type="button"
              onClick={() => setRetrying(true)}
              className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-charcoal px-5 text-sm font-semibold text-cream hover:bg-navy"
            >
              Rregullo dhe dërgo sërish
            </button>
          ) : (
            <RequestForm universities={universities} profile={profile} onSubmit={submit} rejected={verification} />
          )}
        </>
      )}
    </section>
  );
}
