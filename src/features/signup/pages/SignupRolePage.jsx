import { ArrowUpRight, BookOpen, Eye, EyeOff, FileText, GraduationCap, Link2, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { NotFoundMessage } from '../../companies/components/NotFoundMessage';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { Container } from '../../home/components/ui/Container';
import { registerDemoAccount } from '../../login/demoAuth';
import { RepresentativeEmailCheck } from '../../../application/universityUseCases';
import { createActor } from '../../../domain/auth/accessControl';
import { UniversityLogo } from '../../universities/components/UniversityLogo';
import { useUniversityDirectory, useUniversityOptions } from '../../universities/hooks/useUniversityDirectory';
import { signupRoles } from '../roles';

const STUDY_PROGRAMS = [
  'Shkenca kompjuterike',
  'Ekonomi dhe biznes',
  'Inxhinieri',
  'Mjekësi',
  'Juridik',
  'Shkenca sociale',
  'Arkitekturë dhe dizajn',
  'Tjeter',
];

const INDUSTRIES = [
  'Teknologji dhe IT',
  'Financa dhe banka',
  'Shëndetësi',
  'Arsim',
  'Marketing dhe media',
  'Inxhinieri dhe prodhim',
  'Konsulence',
  'Tjeter',
];

const YEAR_OPTIONS = ['Viti i parë', 'Viti i dytë', 'Viti i tretë', 'Viti i katërt', 'Master'];
const GRADUATION_YEARS = ['2026', '2027', '2028', '2029', '2030', '2031', '2032'];
const UNIVERSITIES = ['Universiteti i Prishtinës', 'Universiteti i Prizrenit', 'Universiteti i Gjilanit', 'UBT', 'RIT Kosovo', 'Tjetër'];
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];
const inputClasses =
  'mt-1.5 min-h-12 w-full rounded-xl border border-cream/25 bg-charcoal/35 px-3 text-base text-cream outline-none transition-colors placeholder:text-cream/35 focus:border-cream/80 focus:ring-2 focus:ring-cream/10 aria-invalid:border-2 aria-invalid:border-cream';

const roleFields = {
  student: [
    { name: 'firstName', label: 'Emri', autoComplete: 'given-name' },
    { name: 'lastName', label: 'Mbiemri', autoComplete: 'family-name' },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
    { name: 'phone', label: 'Numri i telefonit', type: 'tel', autoComplete: 'tel' },
    { name: 'city', label: 'Qyteti', autoComplete: 'address-level2' },
    { name: 'country', label: 'Shteti', autoComplete: 'country-name' },
    { name: 'university', label: 'Universiteti', options: UNIVERSITIES, autoComplete: 'organization' },
    { name: 'faculty', label: 'Fakulteti', autoComplete: 'organization-title' },
    { name: 'studyProgram', label: 'Drejtimi i studimeve', options: STUDY_PROGRAMS },
    { name: 'studyYear', label: 'Viti i studimeve', options: YEAR_OPTIONS },
    { name: 'graduationYear', label: 'Viti i pritshëm i diplomimit', options: GRADUATION_YEARS },
    { name: 'gpa', label: 'Mesatarja e notave', placeholder: 'p.sh. 9.1 / 10' },
    { name: 'github', label: 'Lidhja në GitHub', type: 'url', optional: true, placeholder: 'https://github.com/ti' },
    { name: 'portfolio', label: 'Portofoli online', type: 'url', optional: true, placeholder: 'https://portofoli-yt.com' },
    { name: 'cv', label: 'CV / Jetëshkrimi (PDF)', type: 'file', optional: true, accept: 'application/pdf,.pdf', fullWidth: true, help: 'Ngarko CV-në në format PDF.' },
    { name: 'transcript', label: 'Transkripta e notave (PDF)', type: 'file', optional: true, accept: 'application/pdf,.pdf', fullWidth: true, help: 'Ngarko transkriptën akademike në format PDF.' },
    { name: 'password', label: 'Fjalëkalimi', type: 'password', autoComplete: 'new-password' },
  ],
  universitet: [
    { name: 'name', label: 'Universiteti', autoComplete: 'organization' },
    { name: 'representativeName', label: 'Emri dhe mbiemri', autoComplete: 'name' },
    { name: 'representativeTitle', label: 'Roli në universitet', placeholder: 'p.sh. Zyra për Karrierë' },
    { name: 'email', label: 'Email-i zyrtar', type: 'email', autoComplete: 'email' },
    { name: 'phone', label: 'Numri i telefonit', type: 'tel', autoComplete: 'tel' },
    { name: 'password', label: 'Fjalëkalimi', type: 'password', autoComplete: 'new-password' },
  ],
  kompani: [
    { name: 'name', label: 'Emri i kompanisë', autoComplete: 'organization' },
    { name: 'email', label: 'Email i biznesit', type: 'email', autoComplete: 'email' },
    { name: 'website', label: 'Website i kompanise', type: 'url', placeholder: 'https://example.com' },
    { name: 'industry', label: 'Industria', options: INDUSTRIES },
    { name: 'size', label: 'Madhësia e kompanisë', options: COMPANY_SIZES },
    { name: 'country', label: 'Shteti', autoComplete: 'country-name' },
    { name: 'city', label: 'Qyteti', autoComplete: 'address-level2' },
    { name: 'address', label: 'Adresa', autoComplete: 'street-address' },
    { name: 'password', label: 'Fjalëkalimi', type: 'password', autoComplete: 'new-password' },
  ],
};

const STUDENT_GROUPS = [
  { title: 'Të dhënat personale', description: 'Si do të të kontaktojnë kompanitë.', icon: UserRound, fields: ['firstName', 'lastName', 'email', 'phone', 'city', 'country'] },
  { title: 'Të dhënat akademike', description: 'Informacioni i studimeve lidhet drejtpërdrejt me profilin tënd.', icon: BookOpen, fields: ['university', 'faculty', 'studyProgram', 'studyYear', 'graduationYear', 'gpa'] },
  { title: 'Lidhjet profesionale', description: 'Ndaj kodin dhe punët e tua me kompanitë.', icon: Link2, fields: ['github', 'portfolio'] },
  { title: 'Dokumentet', description: 'CV-ja dhe transkripta i ndihmojnë kompanitë të njohin përvojën dhe rezultatet e tua.', icon: FileText, fields: ['cv', 'transcript'] },
  { title: 'Siguria e llogarisë', description: 'Krijo një fjalëkalim të sigurt për llogarinë tënde.', icon: ShieldCheck, fields: ['password'] },
];

const UNIVERSITY_GROUPS = [
  {
    title: 'Universiteti',
    description: 'Zgjidh universitetin ku punon.',
    fields: ['name'],
    wide: ['name'],
  },
  {
    title: 'Përfaqësuesi',
    description: 'Studentët do të të shohin si kontakt në faqen e universitetit.',
    fields: ['representativeName', 'representativeTitle', 'email', 'phone', 'password'],
    wide: ['password'],
  },
];

function validate(fields, values) {
  const errors = {};
  for (const field of fields) {
    const value = (values[field.name] ?? '').trim();
    if (field.optional && !value) continue;
    if (!value) {
      errors[field.name] = `Plotësoni fushën "${field.label}".`;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field.name] = 'Shkruani një adresë emaili të vlefshme.';
    } else if (field.type === 'url' && !/^https?:\/\//i.test(value)) {
      errors[field.name] = 'Website duhet të fillojë me https:// ose http://.';
    } else if (field.type === 'password' && value.length < 8) {
      errors[field.name] = 'Fjalëkalimi duhet të ketë të paktën 8 karaktere.';
    }
  }
  return errors;
}

export function SignupRolePage({ universityUseCases, universityWorkspaceUseCases }) {
  const { role } = useParams();
  const navigate = useNavigate();
  const selectedRole = signupRoles.find((item) => item.id === role);
  const [values, setValues] = useState({});
  const universityOptions = useUniversityOptions(universityUseCases, UNIVERSITIES, values.university);
  const { universities, findByName } = useUniversityDirectory(universityUseCases);
  const fields = roleFields[role]?.map((field) => {
    if (field.name === 'university') return { ...field, options: universityOptions };
    if (role === 'universitet' && field.name === 'name' && universities.length) {
      return { ...field, options: universities.map((university) => university.name) };
    }
    return field;
  });
  const chosenUniversity = role === 'universitet' ? findByName(values.name) : null;
  const staffDomain = chosenUniversity ? universityUseCases.staffDomains(chosenUniversity)[0] : null;
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  useDocumentTitle(selectedRole ? `Regjistrohu si ${selectedRole.title}` : 'Krijo llogari');

  if (!selectedRole || !fields) {
    return (
      <NotFoundMessage
        title="Ky lloj llogarie nuk u gjet."
        description={'Zgjidhni një nga llojet e llogarive.'}
        href="/regjistrohu"
        linkLabel={'Kthehu te zgjedhja e llogarisë'}
      />
    );
  }

  const Icon = selectedRole.icon;
  const update = (name) => (event) => {
    const value = event.target.type === 'file' ? event.target.files?.[0]?.name ?? '' : event.target.value;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(fields, values);
    const emailCheck =
      chosenUniversity && values.email ? universityUseCases.checkRepresentativeEmail(chosenUniversity, values.email) : null;
    if (!nextErrors.email && emailCheck === RepresentativeEmailCheck.MISMATCH) {
      nextErrors.email = `Përdor email-in zyrtar të universitetit (@${staffDomain}).`;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const studentName = role === 'student' ? `${values.firstName} ${values.lastName}`.trim() : values.name;
    const profile = role === 'student'
      ? {
          ...Object.fromEntries(Object.entries(values).filter(([key]) => !['password', 'cv', 'transcript', 'github', 'portfolio'].includes(key))),
          major: values.studyProgram,
          technicalSkills: [],
          softSkills: [],
          languages: [],
          links: { linkedin: '', github: values.github ?? '', portfolio: values.portfolio ?? '' },
          documents: { cv: values.cv ?? '', coverLetter: '', certificates: '', transcript: values.transcript ?? '' },
          preferences: { field: '', workType: '', startDate: '', duration: '' },
          photo: '',
        }
      : Object.fromEntries(Object.entries(values).filter(([key]) => key !== 'password'));

    if (chosenUniversity) {
      profile.universityId = chosenUniversity.id;
      profile.approved = emailCheck === RepresentativeEmailCheck.MATCH;
    }

    const result = registerDemoAccount({
      role,
      title: selectedRole.title,
      email: values.email,
      password: values.password,
      name: studentName,
      profile,
    });
    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    const destination = { student: '/profili', kompani: '/kompani', universitet: '/universitet' }[role] ?? '/';
    if (role === 'universitet' && chosenUniversity && universityWorkspaceUseCases) {
      universityWorkspaceUseCases
        .registerRepresentative(createActor(result.user))
        .catch(() => null)
        .finally(() => navigate(destination));
      return;
    }
    navigate(destination);
  };

  const renderField = (field) => {
    const fieldId = `regjistro-${role}-${field.name}`;
    const errorId = `${fieldId}-gabim`;
    const hintId = `${fieldId}-ndihme`;
    const describedBy = [errors[field.name] ? errorId : '', field.help ? hintId : ''].filter(Boolean).join(' ') || undefined;
    return (
      <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
        <label htmlFor={fieldId} className="text-sm font-semibold">{field.label}{field.optional && <span className="ml-1 font-normal text-cream/55">(opsionale)</span>}</label>
        {field.type === 'file' ? (
          <div className="mt-1.5 rounded-xl border border-dashed border-cream/30 bg-charcoal/20 p-3">
            <input key={values[field.name] ? field.name : `${field.name}-empty`} id={fieldId} name={field.name} type="file" accept={field.accept} onChange={update(field.name)} className="block w-full text-sm text-cream/70 file:mr-3 file:rounded-lg file:border-0 file:bg-cream file:px-3 file:py-2 file:font-semibold file:text-charcoal hover:file:bg-cream/85" aria-invalid={Boolean(errors[field.name])} aria-describedby={describedBy} />
            {values[field.name] && <p className="mt-2 flex items-center justify-between gap-3 text-sm"><span className="truncate">{values[field.name]}</span><button type="button" onClick={() => setValues((current) => ({ ...current, [field.name]: '' }))} className="shrink-0 font-semibold text-cream underline underline-offset-2">Hiqe</button></p>}
          </div>
        ) : field.options ? (
          <select id={fieldId} name={field.name} value={values[field.name] ?? ''} onChange={update(field.name)} className={inputClasses} aria-invalid={Boolean(errors[field.name])} aria-describedby={describedBy}>
            <option value="" className="bg-charcoal">Zgjidhni...</option>
            {field.options.map((option) => <option key={option} value={option} className="bg-charcoal">{option}</option>)}
          </select>
        ) : field.name === 'password' ? (
          <div className="mt-1.5 flex min-h-12 items-center border border-cream/30 bg-charcoal/30 transition-colors focus-within:border-cream">
            <input id={fieldId} name={field.name} type={showPassword ? 'text' : 'password'} autoComplete={field.autoComplete} value={values[field.name] ?? ''} onChange={update(field.name)} className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none" aria-invalid={Boolean(errors[field.name])} aria-describedby={describedBy} />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="grid size-12 shrink-0 place-items-center text-cream/75 hover:text-cream" aria-label={showPassword ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin'}>{showPassword ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}</button>
          </div>
        ) : field.type === 'textarea' ? (
          <textarea id={fieldId} name={field.name} rows={3} value={values[field.name] ?? ''} onChange={update(field.name)} placeholder={field.placeholder} className={`${inputClasses} resize-y`} aria-invalid={Boolean(errors[field.name])} aria-describedby={describedBy} />
        ) : (
          <input id={fieldId} name={field.name} type={field.type ?? 'text'} autoComplete={field.autoComplete} placeholder={field.placeholder} value={values[field.name] ?? ''} onChange={update(field.name)} className={inputClasses} aria-invalid={Boolean(errors[field.name])} aria-describedby={describedBy} />
        )}
        {field.help && <p id={hintId} className="mt-1.5 text-xs text-cream/55">{field.help}</p>}
        {errors[field.name] && <p id={errorId} role="alert" className="mt-1.5 text-sm font-semibold text-cream">{errors[field.name]}</p>}
      </div>
    );
  };

  return (
    <Container className="pt-8 pb-16 lg:pt-10 lg:pb-24">
      <section className={`mx-auto border border-cream/20 p-6 text-cream shadow-2xl sm:p-10 ${role === 'student' ? 'max-w-5xl rounded-3xl bg-charcoal' : `max-w-3xl ${selectedRole.colorClass}`}`}>
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-cream text-charcoal shadow-lg shadow-black/10">
            {role === 'student' ? <GraduationCap aria-hidden="true" className="size-7" strokeWidth={1.5} /> : <Icon aria-hidden="true" className="size-7" strokeWidth={1.5} />}
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-cream/70 uppercase">{role === 'student' ? 'Nis rrugëtimin profesional' : 'Krijo llogari'}</p>
            <h1 className="font-display text-3xl font-medium">{role === 'student' ? 'Regjistrohu si student' : selectedRole.title}</h1>
          </div>
        </div>

        {role === 'student' && <p className="mt-5 max-w-2xl text-sm leading-6 text-cream/70">Plotëso të dhënat që profili yt të jetë gati për mundësi praktike. Aftësitë dhe gjuhët mund t’i shtosh edhe më vonë.</p>}
        <form className="mt-8" onSubmit={handleSubmit} noValidate>
          {role === 'student' && <div className="mb-6 space-y-5">
            {STUDENT_GROUPS.map((group, index) => {
              const GroupIcon = group.icon;
              return <section key={group.title} className="rounded-2xl border border-cream/15 bg-white/[0.035] p-5 sm:p-6">
                <div className="mb-5 flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cream/10 text-cream"><GroupIcon className="size-5" aria-hidden="true" /></span><div><div className="flex items-center gap-2"><span className="text-xs font-bold tracking-widest text-cream/50">0{index + 1}</span><h2 className="text-lg font-semibold">{group.title}</h2></div><p className="mt-1 text-sm text-cream/60">{group.description}</p></div></div>
                <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">{group.fields.map((name) => renderField(fields.find((field) => field.name === name)))}</div>
              </section>;
            })}
          </div>}
          {role !== 'student' && (role === 'universitet' ? UNIVERSITY_GROUPS : [{ fields: fields.map((field) => field.name) }]).map((group) => (
          <section key={group.title ?? 'fushat'} className={group.title ? 'mb-5 rounded-2xl border border-cream/15 bg-white/[0.035] p-5 sm:p-6' : ''}>
            {group.title && (
              <div className="mb-5">
                <h2 className="text-lg font-semibold">{group.title}</h2>
                {group.description && <p className="mt-1 text-sm text-cream/60">{group.description}</p>}
              </div>
            )}
            <div className={`grid grid-cols-1 gap-y-4 ${group.title ? 'gap-x-5 md:grid-cols-2' : ''}`}>
            {fields.filter((field) => group.fields.includes(field.name)).map((field) => {
              const fieldId = `regjistro-${role}-${field.name}`;
              const errorId = `${fieldId}-gabim`;
              return (
                <div key={field.name} className={group.wide?.includes(field.name) ? 'md:col-span-2' : ''}>
                  <label htmlFor={fieldId} className="text-sm font-semibold">{field.label}</label>
                  {field.options ? (
                    <select
                      id={fieldId}
                      name={field.name}
                      value={values[field.name] ?? ''}
                      onChange={update(field.name)}
                      className={inputClasses}
                      aria-invalid={Boolean(errors[field.name])}
                      aria-describedby={errors[field.name] ? errorId : undefined}
                    >
                      <option value="" className="bg-charcoal">Zgjidhni...</option>
                      {field.options.map((option) => <option key={option} value={option} className="bg-charcoal">{option}</option>)}
                    </select>
                  ) : field.name === 'password' ? (
                    <div className="mt-1.5 flex min-h-12 items-center border border-cream/40 bg-charcoal/25 focus-within:border-cream">
                      <input
                        id={fieldId}
                        name={field.name}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={field.autoComplete}
                        value={values[field.name] ?? ''}
                        onChange={update(field.name)}
                        className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none"
                        aria-invalid={Boolean(errors[field.name])}
                        aria-describedby={errors[field.name] ? errorId : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        className="grid size-12 shrink-0 place-items-center text-cream/75 hover:text-cream"
                        aria-label={showPassword ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin'}
                      >
                        {showPassword ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
                      </button>
                    </div>
                  ) : (
                    <input
                      id={fieldId}
                      name={field.name}
                      type={field.type ?? 'text'}
                      autoComplete={field.autoComplete}
                      placeholder={field.placeholder}
                      value={values[field.name] ?? ''}
                      onChange={update(field.name)}
                      className={inputClasses}
                      aria-invalid={Boolean(errors[field.name])}
                      aria-describedby={errors[field.name] ? errorId : undefined}
                    />
                  )}
                  {errors[field.name] && <p id={errorId} role="alert" className="mt-1.5 text-sm font-semibold">{errors[field.name]}</p>}
                  {role === 'universitet' && field.name === 'name' && chosenUniversity && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-charcoal/30 p-3">
                      <UniversityLogo university={chosenUniversity} className="size-11 rounded-lg" padding="p-1" />
                      <p className="text-sm text-cream/80">
                        {chosenUniversity.city}
                        {chosenUniversity.website && ` · ${chosenUniversity.website.replace(/^https?:\/\/(www\.)?/, '')}`}
                      </p>
                    </div>
                  )}
                  {role === 'universitet' && field.name === 'email' && chosenUniversity && !errors.email && (
                    <p className="mt-1.5 text-sm text-cream/70">
                      {staffDomain
                        ? `Duhet të përfundojë me @${staffDomain}.`
                        : 'Ky universitet nuk ka domen të regjistruar. Llogaria aktivizohet pasi InternUp ta konfirmojë.'}
                    </p>
                  )}
                </div>
              );
            })}
            </div>
          </section>
          ))}
          {submitError && <p role="alert" className="mt-4 text-sm font-semibold">{submitError}</p>}
          <button type="submit" className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cream px-6 py-3 font-semibold text-charcoal transition-colors hover:bg-cream/85">
            Regjistrohu {role === 'student' && <ArrowUpRight aria-hidden="true" className="size-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-cream/80">
            {'Ke tashmë llogari?'} <Link to={`/hyr/${role}`} className="font-semibold text-cream underline underline-offset-4">{'Kyçu'}</Link>
        </p>
      </section>
    </Container>
  );
}
