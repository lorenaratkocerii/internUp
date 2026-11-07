import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, GraduationCap, Sparkles, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { WorkMode } from '../../../domain/internship/Internship';
import { getDemoUser } from '../../login/demoAuth';
import { Container } from '../../home/components/ui/Container';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { savePublishedPositionRecord } from '../../../adapters/outbound/mock/publishedPositionsStore';

const PROGRAMS = [
  'Shkenca kompjuterike',
  'Ekonomi dhe biznes',
  'Inxhinieri',
  'Dizajn',
  'Marketing',
  'Tjeter',
];
const STUDY_YEARS = ['Viti 1', 'Viti 2', 'Viti 3', 'Viti 4', 'Master 1', 'Master 2'];
const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];
const INDUSTRIES = ['Teknologji dhe IT', 'Financa', 'Marketing', 'Inxhinieri', 'Shëndetësi', 'Arsim', 'Tjetër'];
const WORK_MODES = [
  { value: WorkMode.REMOTE, label: 'Në distancë' },
  { value: WorkMode.HYBRID, label: 'Hibrid' },
  { value: WorkMode.ON_SITE, label: 'Në zyrë' },
];
const controlClasses =
  'mt-1.5 min-h-12 w-full border border-charcoal/20 bg-white px-3 text-base text-charcoal outline-none transition-colors placeholder:text-charcoal/45 focus:border-burgundy focus:ring-2 focus:ring-burgundy/15 aria-invalid:border-2 aria-invalid:border-burgundy';

function localDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getInitialValues(user) {
  const profile = user?.profile ?? {};
  const closesAt = new Date();
  closesAt.setDate(closesAt.getDate() + 30);
  return {
    companyName: user?.name || profile.name || '',
    industry: profile.industry || '',
    size: profile.size || '',
    website: profile.website || '',
    title: '',
    location: profile.city || '',
    workMode: WorkMode.HYBRID,
    durationMonths: '3',
    schedule: 'Part-time, 20 orë në javë',
    seats: '1',
    opensAt: localDate(new Date()),
    closesAt: localDate(closesAt),
    studyProgram: '',
    studyYear: '',
    skills: '',
    paid: 'yes',
    summary: '',
    duties: '',
  };
}

function validate(values) {
  const errors = {};
  const required = [
    ['companyName', 'Emri i kompanisë'],
    ['industry', 'Industria'],
    ['size', 'Madhësia e kompanisë'],
    ['title', 'Titulli i pozites'],
    ['location', 'Lokacioni'],
    ['durationMonths', 'Kohëzgjatja'],
    ['schedule', 'Orari'],
    ['seats', 'Numri i vendeve'],
    ['opensAt', 'Data e hapjes'],
    ['closesAt', 'Afati i aplikimit'],
    ['studyProgram', 'Drejtimi i studimeve'],
    ['studyYear', 'Viti i studimeve'],
    ['skills', 'Aftësitë e kërkuara'],
    ['summary', 'Përshkrimi i shkurtër'],
    ['duties', 'Detyrat e studentit'],
  ];
  for (const [name, label] of required) {
    if (!String(values[name] ?? '').trim()) errors[name] = `Plotësoni fushën "${label}".`;
  }
  if (Number(values.durationMonths) < 1) errors.durationMonths = 'Kohëzgjatja duhet të jetë të paktën 1 muaj.';
  if (Number(values.seats) < 1) errors.seats = 'Duhet të ketë të paktën një vend të lirë.';
  if (values.opensAt && values.closesAt && values.closesAt < values.opensAt) {
    errors.closesAt = 'Afati i aplikimit nuk mund të jetë para datës së hapjes.';
  }
  if (values.website && !/^https?:\/\//i.test(values.website)) {
    errors.website = 'Website duhet të fillojë me https:// ose http://.';
  }
  return errors;
}

export function PublishPositionPage() {
  const user = getDemoUser();
  const navigate = useNavigate();
  const [values, setValues] = useState(() => getInitialValues(user));
  const [errors, setErrors] = useState({});
  const [showCompanyPrompt, setShowCompanyPrompt] = useState(false);
  useDocumentTitle('Publiko pozitë');

  const update = (name) => (event) => {
    setValues((current) => ({ ...current, [name]: event.target.value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const renderField = (name, label, options = {}) => {
    const { choices, multiline, type, min, rows, wide, ...inputOptions } = options;
    const id = `publiko-${name}`;
    const errorId = `${id}-gabim`;
    const common = {
      id,
      name,
      value: values[name],
      onChange: update(name),
      className: controlClasses,
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? errorId : undefined,
      ...inputOptions,
    };
    return (
      <div key={name} className={wide ? 'md:col-span-2' : ''}>
        <label htmlFor={id} className="text-sm font-semibold text-charcoal/85">{label}</label>
        {choices ? (
          <select {...common} className={`${controlClasses} [color-scheme:light]`}>
            <option value="" className="bg-white text-charcoal">Zgjidhni...</option>
            {choices.map((option) => (
              <option key={option.value ?? option} value={option.value ?? option} className="bg-white text-charcoal">
                {option.label ?? option}
              </option>
            ))}
          </select>
        ) : multiline ? (
          <textarea {...common} rows={rows ?? 5} className={`${controlClasses} min-h-32 py-3`} />
        ) : (
          <input {...common} type={type ?? 'text'} min={min} />
        )}
        {errors[name] && <p id={errorId} role="alert" className="mt-1.5 text-sm font-semibold text-burgundy">{errors[name]}</p>}
      </div>
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (user?.role !== 'kompani') {
      setShowCompanyPrompt(true);
      return;
    }
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const companyId = `demo-${slugify(values.companyName)}`;
    const skills = values.skills.split(',').map((item) => item.trim()).filter(Boolean);
    const responsibilities = values.duties.split('\n').map((item) => item.trim()).filter(Boolean);
    const company = {
      id: companyId,
      name: values.companyName.trim(),
      shortDescription: `Praktika dhe projekte në ${values.industry}.`,
      description: `Kompani në industrinë ${values.industry}, me lokacion në ${values.location}.`,
      history: `Informacioni per ${values.companyName.trim()} eshte shtuar nga llogaria e kompanise.`,
      foundedYear: new Date().getFullYear(),
      location: values.location.trim(),
      website: values.website.trim(),
      industry: values.industry,
      size: values.size,
      workMode: values.workMode,
      technologies: skills,
      culture: 'Ekip bashkëpunues dhe mundësi për të mësuar në punë praktike.',
      benefits: [],
      coverImage: '/images/companies/header.jpg',
      coverAlt: `Kompania ${values.companyName.trim()}`,
      coverPosition: 'center',
    };
    const internship = {
      id: `${slugify(values.title)}-${Date.now()}`,
      title: values.title.trim(),
      companyId,
      company: company.name,
      location: values.location.trim(),
      workMode: values.workMode,
      durationMonths: Number(values.durationMonths),
      schedule: values.schedule.trim(),
      paid: values.paid === 'yes',
      description: values.summary.trim(),
      responsibilities,
      requirements: [values.studyProgram, values.studyYear],
      skills,
      opensAt: values.opensAt,
      closesAt: values.closesAt,
      seats: Number(values.seats),
      featured: true,
    };
    savePublishedPositionRecord({ company, internship });
    navigate(`/kompanite/${companyId}#pozitat`);
  };

  return (
    <Container className="py-8 pb-16 lg:py-12">
      <header className="mb-8 max-w-3xl">
        <p className="inline-flex items-center gap-2 border border-cream/25 px-3 py-1.5 text-xs font-semibold tracking-[0.14em] text-cream/75 uppercase">
          <BriefcaseBusiness aria-hidden="true" className="size-4" />
          {'Për punëdhënësit'}
        </p>
        <h1 className="mt-5 font-display text-4xl leading-tight font-medium tracking-tight sm:text-5xl">
          {'Publiko një pozitë të re'}
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-cream/75">
          {'Përshkruaj rolin, kriteret dhe mundësinë që po i ofron studentit.'}
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:gap-8">
        <form onSubmit={handleSubmit} noValidate className="overflow-hidden border border-charcoal/10 bg-cream text-charcoal shadow-xl">
          <div className="border-b border-charcoal/15 px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold tracking-[0.14em] text-burgundy uppercase">{'Formulari i publikimit'}</p>
            <p className="mt-1 text-sm text-charcoal/65">{'Plotëso fushat për ta publikuar pozitën.'}</p>
          </div>

          <section aria-labelledby="kompania-titull" className="border-b border-charcoal/15 px-6 py-6 sm:px-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-8 place-items-center bg-burgundy text-sm font-bold text-cream">01</span>
              <h2 id="kompania-titull" className="font-display text-2xl font-medium">{'Kompania dhe pozita'}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {renderField('companyName', 'Emri i kompanisë', { wide: true })}
              {renderField('industry', 'Industria', { choices: INDUSTRIES })}
              {renderField('size', 'Madhësia e kompanisë', { choices: SIZES })}
              {renderField('website', 'Website i kompanisë', { type: 'url', placeholder: 'https://example.com', wide: true })}
              {renderField('title', 'Titulli i pozitës', { placeholder: 'p.sh. Praktikant/e në marketing', wide: true })}
              {renderField('location', 'Qyteti / lokacioni')}
              {renderField('workMode', 'Mënyra e punës', { choices: WORK_MODES })}
              {renderField('durationMonths', 'Kohëzgjatja (muaj)', { type: 'number', min: 1 })}
              {renderField('schedule', 'Orari i punës', { placeholder: 'p.sh. Part-time, 20 orë në javë' })}
              {renderField('seats', 'Vende të lira', { type: 'number', min: 1 })}
              {renderField('paid', 'Pagesa', { choices: [{ value: 'yes', label: 'Me pagesë' }, { value: 'no', label: 'Pa pagesë' }] })}
              {renderField('opensAt', 'Hapja e aplikimeve', { type: 'date' })}
              {renderField('closesAt', 'Afati i aplikimit', { type: 'date' })}
            </div>
          </section>

          <section aria-labelledby="kriteret-titull" className="border-b border-charcoal/15 px-6 py-6 sm:px-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-8 place-items-center bg-navy text-sm font-bold text-cream">02</span>
              <div>
                <h2 id="kriteret-titull" className="font-display text-2xl font-medium">{'Kriteret për studentin'}</h2>
                <p className="mt-1 text-sm text-charcoal/65">{'Trego kë po kërkon për këtë pozitë.'}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {renderField('studyProgram', 'Drejtimi i studimeve', { choices: PROGRAMS })}
              {renderField('studyYear', 'Viti i studimeve', { choices: STUDY_YEARS })}
              {renderField('skills', 'Aftësitë e kërkuara', { placeholder: 'Shkruaj aftësitë, ndaji me presje', wide: true })}
            </div>
          </section>

          <section aria-labelledby="pershkrimi-titull" className="px-6 py-6 sm:px-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-8 place-items-center bg-terracotta text-sm font-bold text-cream">03</span>
              <div>
                <h2 id="pershkrimi-titull" className="font-display text-2xl font-medium">{'Përshkrimi i punës'}</h2>
                <p className="mt-1 text-sm text-charcoal/65">{'Përshkruaj projektin dhe detyrat e studentit.'}</p>
              </div>
            </div>
            <div className="grid gap-4">
              {renderField('summary', 'Përmbledhje e pozitës', { multiline: true, rows: 3 })}
              {renderField('duties', 'Çfarë do të bëjë studenti?', { multiline: true, wide: true })}
            </div>
          </section>

          <div className="border-t border-charcoal/15 bg-white/45 px-6 py-5 sm:px-8">
            <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-charcoal px-6 py-3 font-semibold text-cream transition-colors hover:bg-navy sm:w-auto">
              {'Publiko pozitën'}
              <ArrowRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        </form>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="relative overflow-hidden bg-navy p-6 text-cream sm:p-7">
            <div aria-hidden="true" className="absolute -top-12 -right-10 size-40 rounded-full border-[24px] border-cream/10" />
            <span className="relative grid size-12 place-items-center bg-cream text-charcoal">
              <Sparkles aria-hidden="true" className="size-6" />
            </span>
            <h2 className="relative mt-6 font-display text-3xl font-medium leading-tight">{'Zgjero ekipin tënd!'}</h2>
            <p className="relative mt-3 leading-relaxed text-cream/80">
              {'Gjej studentë të motivuar dhe jepu mundësinë të rriten me ekipin tënd.'}
            </p>
            <ul className="relative mt-6 space-y-4 border-t border-cream/20 pt-5 text-sm leading-relaxed">
              <li className="flex gap-3"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cream" />{'Përcakto qartë kriteret që kërkon.'}</li>
              <li className="flex gap-3"><GraduationCap aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cream" />{'Lidhe pozitën me drejtimin dhe vitin e studimeve.'}</li>
              <li className="flex gap-3"><BriefcaseBusiness aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cream" />{'Shpjego projektet dhe detyrat që do të marrë përsipër studenti.'}</li>
            </ul>
            <div className="relative mt-7 flex items-center justify-between border-t border-cream/20 pt-5 text-sm font-semibold">
              {'Gati për hapin tjetër?'}
              <ArrowUpRight aria-hidden="true" className="size-5" />
            </div>
          </div>

          <div className="border border-cream/20 bg-charcoal p-5 text-cream">
            <div className="flex items-center gap-2 text-sm font-semibold text-cream">
              <Users aria-hidden="true" className="size-4" />
              {'Këshillë'}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-cream/70">
              {'Ndarja e detyrave në pika tî shkurtra ua bën studentëve më të lehtë të kuptojnë rolin.'}
            </p>
          </div>
        </aside>
      </div>
      {showCompanyPrompt && <div className="fixed inset-0 z-[70] grid place-items-center bg-charcoal/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCompanyPrompt(false); }}><section role="dialog" aria-modal="true" aria-labelledby="company-account-title" className="w-full max-w-md rounded-2xl border border-cream/15 bg-charcoal p-6 text-cream shadow-2xl sm:p-8"><p className="text-xs font-semibold tracking-[0.16em] text-cream/55 uppercase">Publikimi i pozitës</p><h2 id="company-account-title" className="mt-2 font-display text-3xl">Publiko si kompani</h2><p className="mt-3 leading-relaxed text-cream/70">Për të publikuar këtë pozitë, duhet të kyçesh me llogari kompanie.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Link to="/hyr/kompani" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-cream px-4 py-3 text-center font-semibold text-charcoal hover:bg-cream/85">Kam llogari — Kyçu</Link><Link to="/regjistrohu/kompani" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-cream/25 px-4 py-3 text-center font-semibold hover:bg-cream/10">Regjistrohu si kompani</Link></div><button type="button" onClick={() => setShowCompanyPrompt(false)} className="mt-4 min-h-10 w-full text-sm font-medium text-cream/55 hover:text-cream">Mbyll</button></section></div>}
    </Container>
  );
}
