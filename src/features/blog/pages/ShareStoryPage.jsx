import { ArrowLeft, EyeOff, GraduationCap, LockKeyhole, PenLine, Send, UserPlus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { StoryError } from '../../../application/blogUseCases';
import { StoryLimits } from '../../../domain/blog/Story';
import { STORY_CATEGORIES, STORY_FIELDS, StoryWorkMode, WORK_MODE_LABELS } from '../../../domain/blog/storyTaxonomy';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { ButtonLink } from '../../home/components/ui/Button';
import { Container } from '../../home/components/ui/Container';
import { useAsyncData } from '../../home/hooks/useAsyncData';
import { seedProfile, STUDENT_KEY } from '../../student/studentData';
import { ImageUpload } from '../components/ImageUpload';
import { AuthorAvatar } from '../components/StoryBadges';
import { useViewer } from '../hooks/useViewer';
import { SHARE_STORY_PATH } from '../components/BlogHero';

const controlClasses =
  'mt-1.5 min-h-12 w-full border border-charcoal/20 bg-white px-3 text-base text-charcoal outline-none transition-colors placeholder:text-charcoal/45 focus:border-burgundy focus:ring-2 focus:ring-burgundy/15 aria-invalid:border-2 aria-invalid:border-burgundy';

const DRAFT_KEY = 'internup:blog-draft';
const NO_COMPANIES = [];

function readStudentProfile(viewer) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STUDENT_KEY) ?? 'null');
    if (stored) return stored;
  } catch {
  }
  return viewer.email === seedProfile.email ? seedProfile : {};
}

function initialValues(viewer) {
  const profile = readStudentProfile(viewer);
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || viewer.name || '';
  const base = {
    title: '',
    excerpt: '',
    content: '',
    category: '',
    field: '',
    authorName: fullName,
    university: profile.university ?? viewer.profile?.university ?? '',
    studyProgram: profile.major ?? '',
    companyId: '',
    position: '',
    durationMonths: '3',
    workMode: StoryWorkMode.HYBRID,
    location: '',
    challenges: '',
    skills: '',
    coverImage: '',
    anonymous: false,
    acceptsGuidelines: false,
  };
  try {
    const draft = JSON.parse(window.sessionStorage.getItem(DRAFT_KEY) ?? 'null');
    return draft ? { ...base, ...draft, coverImage: '' } : base;
  } catch {
    return base;
  }
}

function StudentOnlyGate({ viewer }) {
  const loggedInOtherRole = Boolean(viewer.role);
  return (
    <Container className="py-16 lg:py-24">
      <div className="mx-auto max-w-xl border border-cream/20 bg-navy p-8 text-center shadow-2xl sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-cream text-charcoal">
          <LockKeyhole aria-hidden="true" className="size-7" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-medium">Vetëm studentët mund të ndajnë histori</h1>
        <p className="mt-3 text-cream/75">
          {loggedInOtherRole
            ? 'Je kyçur me një llogari që nuk është studentore. Dil dhe hyr si student për të publikuar përvojën tënde.'
            : 'Hyr me llogarinë tënde studentore që historia të lidhet me profilin tënd dhe të marrë shenjën “Praktikant i verifikuar” pas konfirmimit.'}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href={`/hyr/student?next=${encodeURIComponent(SHARE_STORY_PATH)}`} icon={GraduationCap}>
            Hyr si student
          </ButtonLink>
          <ButtonLink href="/regjistrohu/student" variant="ghost" icon={UserPlus}>
            Krijo llogari
          </ButtonLink>
        </div>
        <Link to="/blog" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cream/75 hover:text-cream">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Kthehu te blogu
        </Link>
      </div>
    </Container>
  );
}

function Fieldset({ legend, description, children }) {
  return (
    <fieldset className="border-t border-charcoal/15 pt-8 first:border-t-0 first:pt-0">
      <legend className="font-display text-2xl font-medium">{legend}</legend>
      {description && <p className="mt-1 text-sm text-charcoal/65">{description}</p>}
      <div className="mt-5 grid gap-5 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function ShareStoryPage({ useCases }) {
  useDocumentTitle('Ndaj historinë tënde');
  const viewer = useViewer();
  const navigate = useNavigate();
  const [values, setValues] = useState(() => initialValues(viewer));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loadCompanies = useCallback(() => useCases.listCompanyOptions(), [useCases]);
  const companies = useAsyncData(loadCompanies);
  const companyOptions = companies.data ?? NO_COMPANIES;

  if (viewer.role !== 'student') return <StudentOnlyGate viewer={viewer} />;

  const setValue = (name, value) => {
    setValues((current) => {
      const next = { ...current, [name]: value };
      try {
        const { coverImage, ...draft } = next;
        window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
      }
      return next;
    });
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const field = (name, label, options = {}) => {
    const { choices, multiline, rows, wide, hint, counter, ...inputProps } = options;
    const id = `histori-${name}`;
    const errorId = `${id}-gabim`;
    const hintId = `${id}-ndihme`;
    const describedBy = [errors[name] && errorId, hint && hintId].filter(Boolean).join(' ') || undefined;
    const common = {
      id,
      name,
      value: values[name],
      onChange: (event) => {
        setValue(name, event.target.value);
        if (name === 'companyId' && !values.location.trim()) {
          const company = companyOptions.find((item) => item.id === event.target.value);
          if (company) setValue('location', company.location);
        }
      },
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': describedBy,
      ...inputProps,
    };
    const length = String(values[name] ?? '').trim().length;

    return (
      <div className={wide ? 'md:col-span-2' : ''}>
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={id} className="text-sm font-semibold text-charcoal/85">
            {label}
          </label>
          {counter && (
            <span className={`text-xs tabular-nums ${length > counter ? 'font-semibold text-burgundy' : 'text-charcoal/55'}`}>
              {length}/{counter}
            </span>
          )}
        </div>
        {choices ? (
          <select {...common} className={`${controlClasses} cursor-pointer [color-scheme:light]`}>
            <option value="">Zgjidh...</option>
            {choices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        ) : multiline ? (
          <textarea {...common} rows={rows ?? 5} className={`${controlClasses} py-3 leading-relaxed`} />
        ) : (
          <input {...common} type={inputProps.type ?? 'text'} className={controlClasses} />
        )}
        {hint && (
          <p id={hintId} className="mt-1.5 text-xs text-charcoal/60">
            {hint}
          </p>
        )}
        {errors[name] && (
          <p id={errorId} role="alert" className="mt-1.5 text-sm font-semibold text-burgundy">
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    const nextErrors = useCases.validateStoryDraft(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormError('Disa fusha kanë nevojë për vëmendje.');
      const form = event.currentTarget;
      requestAnimationFrame(() => form.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    setIsSubmitting(true);
    try {
      const story = await useCases.publishStory(values, viewer);
      try {
        window.sessionStorage.removeItem(DRAFT_KEY);
      } catch {
      }
      navigate(`/blog/${story.id}`, { state: { published: true } });
    } catch (error) {
      if (error instanceof StoryError && Object.keys(error.fieldErrors).length) setErrors(error.fieldErrors);
      setFormError(error.message || 'Historia nuk u publikua. Provo përsëri.');
      setIsSubmitting(false);
    }
  };

  const previewAuthor = values.anonymous
    ? { initials: '?', name: 'Student anonim' }
    : {
        initials: (values.authorName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || '?'),
        name: values.authorName.trim() || 'Emri yt',
      };

  return (
    <>
      <header className="border-b border-cream/10">
        <Container className="pt-8 pb-10 lg:pt-12">
          <Link to="/blog" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cream/75 hover:text-cream">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Kthehu te Blogu i Studentëve
          </Link>
          <p className="mt-6 text-sm font-semibold tracking-[0.18em] text-cream/70 uppercase">Ndaj historinë tënde</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
            Ndaj përvojën tënde të praktikës.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-cream/75">
            Shkruaj sinqerisht — çfarë shkoi mirë, çfarë ishte e vështirë dhe çfarë do t’i këshilloje një studenti që fillon.
          </p>
        </Container>
      </header>

      <Container className="grid gap-8 py-10 lg:grid-cols-12 lg:py-14">
        <form noValidate onSubmit={handleSubmit} className="space-y-8 bg-cream p-6 text-charcoal sm:p-9 lg:col-span-8">
          <Fieldset legend="Historia" description="Titulli dhe përmbledhja shfaqen në kartat e blogut.">
            {field('title', 'Titulli', {
              wide: true,
              counter: StoryLimits.TITLE_MAX,
              placeholder: 'p.sh. Java ime e parë si praktikante në një fintech',
            })}
            {field('excerpt', 'Përmbledhja e shkurtër', {
              wide: true,
              multiline: true,
              rows: 2,
              counter: StoryLimits.EXCERPT_MAX,
              placeholder: 'Një ose dy fjali që e tërheqin lexuesin.',
            })}
            {field('category', 'Kategoria', {
              choices: STORY_CATEGORIES.map((category) => ({ value: category.id, label: category.label })),
            })}
            {field('field', 'Fusha', { choices: STORY_FIELDS.map((item) => ({ value: item, label: item })) })}
            {field('content', 'Përvoja jote', {
              wide: true,
              multiline: true,
              rows: 12,
              hint: 'Ndaje tekstin në paragrafë me një rresht bosh mes tyre. Minimumi 300 karaktere.',
              placeholder: 'Si e gjete praktikën? Si ishte dita e parë? Çfarë të befasoi?',
            })}
            <div className="md:col-span-2">
              <ImageUpload value={values.coverImage} onChange={(value) => setValue('coverImage', value)} />
            </div>
          </Fieldset>

          <Fieldset legend="Praktika" description="Këto detaje i ndihmojnë studentët të gjejnë historinë tënde.">
            {field('companyId', 'Kompania', {
              choices: companyOptions.map((company) => ({ value: company.id, label: `${company.name} — ${company.location}` })),
              disabled: companies.status === 'loading',
              hint:
                companies.status === 'error'
                  ? 'Kompanitë nuk u ngarkuan. Rifresko faqen.'
                  : 'Vetëm kompanitë që janë aktualisht në InternUp.',
            })}
            {field('position', 'Pozita', { placeholder: 'p.sh. Praktikante Frontend' })}
            {field('durationMonths', 'Kohëzgjatja (muaj)', {
              type: 'number',
              min: StoryLimits.DURATION_MIN,
              max: StoryLimits.DURATION_MAX,
              inputMode: 'numeric',
            })}
            {field('workMode', 'Work mode', {
              choices: Object.values(StoryWorkMode).map((mode) => ({ value: mode, label: WORK_MODE_LABELS[mode] })),
            })}
            {field('location', 'Lokacioni', { placeholder: 'p.sh. Prishtinë' })}
            <div className="hidden md:block" aria-hidden="true" />
            {field('challenges', 'Sfidat', {
              multiline: true,
              rows: 4,
              hint: 'Një sfidë për rresht ose të ndara me presje (deri në 8).',
              placeholder: 'Menaxhimi i kohës\nFrika për të bërë pyetje',
            })}
            {field('skills', 'Aftësitë e fituara', {
              multiline: true,
              rows: 4,
              hint: 'Një aftësi për rresht ose të ndara me presje (deri në 8).',
              placeholder: 'React, Git, Komunikim në ekip',
            })}
          </Fieldset>

          <Fieldset legend="Rreth teje">
            {field('authorName', 'Emri yt', { autoComplete: 'name', disabled: values.anonymous })}
            {field('university', 'Universiteti', { placeholder: 'p.sh. Universiteti i Prishtinës' })}
            {field('studyProgram', 'Drejtimi i studimeve', { wide: true, placeholder: 'p.sh. Shkenca Kompjuterike' })}
            <label className="flex cursor-pointer items-start gap-3 border border-charcoal/20 bg-white p-4 md:col-span-2">
              <input
                type="checkbox"
                checked={values.anonymous}
                onChange={(event) => setValue('anonymous', event.target.checked)}
                className="mt-0.5 size-5 shrink-0 cursor-pointer accent-burgundy"
              />
              <span>
                <span className="flex items-center gap-2 font-semibold">
                  <EyeOff aria-hidden="true" className="size-4" />
                  Publiko në mënyrë anonime
                </span>
                <span className="mt-1 block text-sm text-charcoal/70">
                  Emri yt nuk do të shfaqet publikisht. Universiteti dhe kompania mbeten të dukshme që historia të jetë e
                  dobishme.
                </span>
              </span>
            </label>
          </Fieldset>

          <div className="border-t border-charcoal/15 pt-8">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                id="histori-acceptsGuidelines"
                type="checkbox"
                checked={values.acceptsGuidelines}
                onChange={(event) => setValue('acceptsGuidelines', event.target.checked)}
                aria-invalid={Boolean(errors.acceptsGuidelines)}
                className="mt-0.5 size-5 shrink-0 cursor-pointer accent-burgundy"
              />
              <span className="text-sm text-charcoal/80">
                Konfirmoj që kjo është përvoja ime e vërtetë dhe nuk përmban të dhëna konfidenciale të kompanisë apo
                informata personale të kolegëve.
              </span>
            </label>
            {errors.acceptsGuidelines && (
              <p role="alert" className="mt-1.5 text-sm font-semibold text-burgundy">
                {errors.acceptsGuidelines}
              </p>
            )}

            {formError && (
              <p role="alert" className="mt-6 border-l-2 border-burgundy bg-burgundy/5 px-4 py-3 font-semibold text-burgundy">
                {formError}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex min-h-12 cursor-pointer items-center justify-center gap-3 bg-charcoal px-6 py-3 font-semibold text-cream transition-colors hover:bg-navy disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? 'Po publikohet…' : 'Publiko historinë'}
                <Send aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
              <Link
                to="/blog"
                className="inline-flex min-h-12 items-center justify-center px-6 font-semibold text-charcoal underline underline-offset-4"
              >
                Anulo
              </Link>
            </div>
          </div>
        </form>

        <aside aria-label="Parapamja dhe këshilla" className="space-y-5 lg:col-span-4">
          <div className="bg-navy p-6 lg:sticky lg:top-24">
            <p className="text-xs font-semibold tracking-[0.16em] text-cream/60 uppercase">Parapamja e autorit</p>
            <div className="mt-4 flex items-center gap-3">
              <AuthorAvatar author={previewAuthor} anonymous={values.anonymous} size="lg" />
              <div className="min-w-0">
                <p className="truncate font-semibold">{previewAuthor.name}</p>
                <p className="truncate text-sm text-cream/65">{values.university || 'Universiteti yt'}</p>
              </div>
            </div>
            <p className="mt-4 line-clamp-3 font-display text-xl leading-snug">
              {values.title || 'Titulli i historisë sate do të shfaqet këtu.'}
            </p>

            <div className="mt-6 border-t border-cream/15 pt-5">
              <p className="flex items-center gap-2 font-semibold">
                <PenLine aria-hidden="true" className="size-4" />
                Këshilla për një histori të mirë
              </p>
              <ul className="mt-3 space-y-2 text-sm text-cream/75">
                <li>• Fillo me një moment konkret, jo me një përshkrim të përgjithshëm.</li>
                <li>• Trego edhe gabimet — ato janë më të dobishmet për lexuesit.</li>
                <li>• Përmend mjetet dhe aftësitë që i përdore çdo ditë.</li>
                <li>• Mbyll me një këshillë për studentët që po aplikojnë.</li>
              </ul>
            </div>
          </div>
        </aside>
      </Container>
    </>
  );
}
