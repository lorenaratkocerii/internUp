import { useRef, useState } from 'react';
import { FileText, Pencil, Plus, Save, Trash2, Upload, UserRound } from 'lucide-react';
import { getDemoUser } from '../../login/demoAuth';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { useUniversityOptions } from '../../universities/hooks/useUniversityDirectory';
import { StudentWorkspace } from '../components/StudentWorkspace';
import { languageOptions, readStudentProfile, saveStudentProfile } from '../studentData';

const inputClass = 'mt-1.5 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white/70 px-3 py-2 text-sm text-charcoal outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10';

function Field({ label, name, value, onChange, type = 'text', placeholder, required = false, options, disabled = false, error }) {
  return <label className="block text-sm font-semibold text-charcoal">{label}{required && <span className="ml-1 text-terracotta">*</span>}{options ? <select name={name} value={value ?? ''} onChange={onChange} disabled={disabled} aria-invalid={Boolean(error)} className={`${inputClass} disabled:cursor-not-allowed disabled:bg-charcoal/5 disabled:text-charcoal/70`}><option value="">Zgjidh...</option>{options.map((option) => <option key={option}>{option}</option>)}</select> : <input name={name} type={type} value={value ?? ''} onChange={onChange} placeholder={placeholder} disabled={disabled} aria-invalid={Boolean(error)} className={`${inputClass} disabled:cursor-not-allowed disabled:bg-charcoal/5 disabled:text-charcoal/70`} />}{error && <span role="alert" className="mt-1 block text-xs font-semibold text-terracotta">{error}</span>}</label>;
}

function SectionCard({ id, number, title, description, children }) {
  return <section id={id} className="scroll-mt-24 rounded-2xl border border-cream/15 bg-cream p-5 text-charcoal shadow-lg sm:p-7"><div className="mb-6 flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-charcoal text-sm font-semibold text-cream">{number}</span><div><h3 className="font-display text-2xl">{title}</h3>{description && <p className="mt-1 text-sm text-charcoal/60">{description}</p>}</div></div>{children}</section>;
}

function FileUpload({ label, value, onChange, disabled }) {
  return <div className="rounded-xl border border-charcoal/15 bg-white/45 p-4"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-navy/10 text-navy"><FileText aria-hidden="true" className="size-5" /></span><div className="min-w-0"><p className="text-sm font-semibold">{label}</p><p className="mt-1 truncate text-xs text-charcoal/55">{value || 'Vetëm PDF · deri në 10 MB'}</p></div></div>{value && <button type="button" disabled={disabled} onClick={() => onChange('')} aria-label={`Hiq ${label}`} className="grid size-9 shrink-0 place-items-center rounded-lg text-charcoal/50 hover:bg-terracotta/10 hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40"><Trash2 aria-hidden="true" className="size-4" /></button>}</div><label className={`mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg border border-charcoal/15 px-3 text-xs font-semibold ${disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer hover:bg-white/60'}`}><Upload aria-hidden="true" className="size-3.5" />{value ? 'Zëvendëso skedarin' : 'Ngarko PDF'}<input type="file" accept="application/pdf,.pdf" disabled={disabled} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) && file.size <= 10 * 1024 * 1024) onChange(file.name); event.target.value = ''; }} /></label></div>;
}

function SkillEditor({ title, skills, onChange, placeholder, disabled }) {
  const [value, setValue] = useState('');
  const add = () => { const skill = value.trim(); if (skill && !skills.includes(skill)) onChange([...skills, skill]); setValue(''); };
  return <div><p className="text-sm font-semibold">{title}</p><div className="mt-2 flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 bg-white/50 px-3 py-1.5 text-sm">{skill}<button type="button" disabled={disabled} onClick={() => onChange(skills.filter((item) => item !== skill))} aria-label={`Hiq ${skill}`} className="text-charcoal/55 hover:text-terracotta disabled:hidden">×</button></span>)}</div>{!disabled && <div className="mt-3 flex gap-2"><input value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); add(); } }} placeholder={placeholder} className="min-h-10 min-w-0 flex-1 rounded-lg border border-charcoal/15 bg-white/60 px-3 text-sm" /><button type="button" onClick={add} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-charcoal px-3 text-sm font-semibold text-cream"><Plus aria-hidden="true" className="size-4" />Shto</button></div>}</div>;
}

const FALLBACK_UNIVERSITIES = ['Universiteti i Prishtinës', 'Universiteti i Prizrenit', 'Universiteti i Gjilanit', 'UBT', 'RIT Kosovo', 'Tjetër'];

export function StudentProfilePage({ universityUseCases }) {
  useDocumentTitle('Profili im');
  const user = getDemoUser();
  const [profile, setProfile] = useState(() => readStudentProfile(user));
  const universityOptions = useUniversityOptions(universityUseCases, FALLBACK_UNIVERSITIES, profile.university);
  const originalProfile = useRef(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const hasChanges = JSON.stringify(profile) !== JSON.stringify(originalProfile.current);

  const update = (event) => {
    const { name, value } = event.target;
    if (name.startsWith('links.')) {
      const key = name.split('.')[1];
      setProfile((current) => ({ ...current, links: { ...current.links, [key]: value } }));
    } else if (name.startsWith('preferences.')) {
      const key = name.split('.')[1];
      setProfile((current) => ({ ...current, preferences: { ...current.preferences, [key]: value } }));
    } else {
      setProfile((current) => ({ ...current, [name]: value }));
    }
    setErrors((current) => ({ ...current, [name]: '' }));
    setSaved(false);
  };
  const updatePhoto = (event) => {
    if (!isEditing) return;
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setProfile((current) => ({ ...current, photo: String(reader.result) }));
    reader.readAsDataURL(file);
    event.target.value = '';
  };
  const save = (event) => {
    event.preventDefault();
    if (!isEditing) return;
    const required = ['firstName', 'lastName', 'email', 'phone', 'city', 'country', 'university', 'faculty', 'major', 'studyYear', 'graduationYear', 'gpa'];
    const nextErrors = {};
    for (const field of required) {
      if (!String(profile[field] ?? '').trim()) nextErrors[field] = 'Kjo fushë është e detyrueshme.';
    }
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) nextErrors.email = 'Shkruaj një adresë elektronike të vlefshme.';
    for (const [key, value] of Object.entries(profile.links ?? {})) {
      if (value && !/^https?:\/\/[^\s.]+(?:\.[^\s.]+)+/i.test(value)) nextErrors[`links.${key}`] = 'Lidhja duhet të fillojë me https:// ose http://.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => {
        const firstInvalid = document.querySelector('[aria-invalid="true"]');
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid?.focus({ preventScroll: true });
      });
      return;
    }
    saveStudentProfile(user, profile);
    originalProfile.current = profile;
    setIsEditing(false);
    setSaved(true);
  };
  const cancelEdit = () => {
    setProfile(originalProfile.current);
    setErrors({});
    setSaved(false);
    setIsEditing(false);
  };
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Profili yt';

  return <StudentWorkspace title="Profili im" subtitle="Përditësimi i profilit">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold tracking-[0.16em] text-cream/50 uppercase">Të dhënat e tua</p><h2 className="mt-2 font-display text-4xl text-cream">Profili im</h2><p className="mt-2 text-cream/65">Mbaji të përditësuara të dhënat që kompanitë të të njohin më mirë.</p>{saved && <p role="status" className="mt-2 text-sm font-medium text-cream">Ndryshimet u ruajtën me sukses.</p>}</div><div className="flex flex-wrap gap-2">{isEditing && <button type="button" onClick={cancelEdit} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-cream/25 px-4 py-2.5 font-semibold text-cream hover:bg-cream/10">Anulo</button>}{isEditing ? hasChanges && <button type="submit" form="student-profile-form" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cream px-4 py-2.5 font-semibold text-charcoal hover:bg-cream/90"><Save aria-hidden="true" className="size-4" />Ruaj ndryshimet</button> : <button type="button" onClick={() => { setIsEditing(true); setSaved(false); }} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cream px-4 py-2.5 font-semibold text-charcoal hover:bg-cream/90"><Pencil aria-hidden="true" className="size-4" />Ndrysho profilin</button>}</div></div>
    <div className="mt-6">
      <form id="student-profile-form" onSubmit={save} className="min-w-0 space-y-5">
        <SectionCard id="personal" number="01" title="Të dhënat personale" description="Informacioni bazë që u nevojitet kompanive për të të njohur.">
          <div className="mb-6"><div className="relative size-20"><div className="grid size-full place-items-center overflow-hidden rounded-2xl bg-navy text-cream">{profile.photo ? <img src={profile.photo} alt={`Fotografia e profilit të ${name}`} className="size-full object-cover" /> : <UserRound aria-hidden="true" className="size-8" />}</div>{isEditing && <label title="Ndrysho fotografinë" className="absolute -right-2 -bottom-2 grid size-9 cursor-pointer place-items-center rounded-full border-2 border-cream bg-charcoal text-cream shadow-md transition-colors hover:bg-navy"><Pencil aria-hidden="true" className="size-4" /><span className="sr-only">Ndrysho fotografinë</span><input type="file" accept="image/*" className="sr-only" onChange={updatePhoto} /></label>}</div></div>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Emri" name="firstName" value={profile.firstName} onChange={update} required disabled={!isEditing} error={errors.firstName} /><Field label="Mbiemri" name="lastName" value={profile.lastName} onChange={update} required disabled={!isEditing} error={errors.lastName} /><Field label="Adresa elektronike" name="email" type="email" value={profile.email} onChange={update} required disabled={!isEditing} error={errors.email} /><Field label="Numri i telefonit" name="phone" type="tel" value={profile.phone} onChange={update} required disabled={!isEditing} error={errors.phone} /><Field label="Qyteti" name="city" value={profile.city} onChange={update} required disabled={!isEditing} error={errors.city} /><Field label="Shteti" name="country" value={profile.country} onChange={update} required disabled={!isEditing} error={errors.country} /></div>
        </SectionCard>

        <SectionCard id="academic" number="02" title="Të dhënat akademike" description="Studimet e tua aktuale dhe viti i pritshëm i diplomimit.">
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Universiteti" name="university" value={profile.university} onChange={update} options={universityOptions} required disabled={!isEditing} error={errors.university} /><Field label="Fakulteti" name="faculty" value={profile.faculty} onChange={update} placeholder="Fakulteti ose shkolla" required disabled={!isEditing} error={errors.faculty} /><Field label="Drejtimi i studimeve" name="major" value={profile.major} onChange={update} placeholder="p.sh. Shkenca Kompjuterike" required disabled={!isEditing} error={errors.major} /><Field label="Viti aktual i studimeve" name="studyYear" value={profile.studyYear} onChange={update} options={['Viti i parë', 'Viti i dytë', 'Viti i tretë', 'Viti i katërt', 'Master']} required disabled={!isEditing} error={errors.studyYear} /><Field label="Viti i pritshëm i diplomimit" name="graduationYear" value={profile.graduationYear} onChange={update} options={['2026', '2027', '2028', '2029', '2030', '2031']} required disabled={!isEditing} error={errors.graduationYear} /><Field label="Mesatarja e notave" name="gpa" value={profile.gpa} onChange={update} placeholder="p.sh. 9.1 / 10" required disabled={!isEditing} error={errors.gpa} /></div>
        </SectionCard>

        <SectionCard id="skills" number="03" title="Aftësitë dhe kualifikimet" description="Shto aftësitë që përputhen me punën që dëshiron të bësh."><div className="space-y-6"><SkillEditor title="Aftësitë teknike" skills={profile.technicalSkills ?? []} onChange={(technicalSkills) => setProfile((current) => ({ ...current, technicalSkills }))} placeholder="Shto një aftësi teknike" disabled={!isEditing} /><SkillEditor title="Aftësitë ndërpersonale" skills={profile.softSkills ?? []} onChange={(softSkills) => setProfile((current) => ({ ...current, softSkills }))} placeholder="Shto një aftësi ndërpersonale" disabled={!isEditing} /></div></SectionCard>

        <SectionCard id="languages" number="04" title="Gjuhët" description="Zgjidh disa gjuhë dhe cakto nivelin për secilën."><div className="space-y-3">{profile.languages.map((language, index) => <div key={`${language.name}-${index}`} className="grid gap-2 rounded-xl border border-charcoal/10 bg-white/40 p-3 sm:grid-cols-[1fr_12rem_auto]"><p className="flex min-h-10 items-center px-3 text-sm font-medium">{language.name}</p><select disabled={!isEditing} aria-label={`Niveli i gjuhës ${language.name}`} value={language.level} onChange={(event) => setProfile((current) => ({ ...current, languages: current.languages.map((item, i) => i === index ? { ...item, level: event.target.value } : item) }))} className="min-h-10 rounded-lg border border-charcoal/15 bg-white/60 px-3 text-sm disabled:cursor-not-allowed disabled:bg-charcoal/5">{['Fillestare', 'Mesatare', 'E avancuar', 'Amtare'].map((level) => <option key={level}>{level}</option>)}</select>{isEditing && <button type="button" onClick={() => setProfile((current) => ({ ...current, languages: current.languages.filter((_, i) => i !== index) }))} aria-label={`Hiq gjuhën ${language.name}`} className="grid min-h-10 place-items-center rounded-lg px-2 text-charcoal/50 hover:bg-terracotta/10 hover:text-terracotta"><Trash2 aria-hidden="true" className="size-4" /></button>}</div>)}{isEditing && <label className="block max-w-sm text-sm font-semibold">Shto gjuhë<select value="" onChange={(event) => { const name = event.target.value; if (name && !profile.languages.some((item) => item.name === name)) setProfile((current) => ({ ...current, languages: [...current.languages, { name, level: 'Fillestare' }] })); }} className={inputClass}><option value="">Zgjidh një gjuhë…</option>{languageOptions.map((language) => <option key={language} value={language} disabled={profile.languages.some((item) => item.name === language)}>{language}</option>)}</select></label>}</div></SectionCard>

        <SectionCard id="links" number="05" title="Lidhjet profesionale" description="Ndaj punët, kodin dhe profilin tënd profesional."><div className="grid gap-4"><Field label="Lidhja në LinkedIn" name="links.linkedin" type="url" value={profile.links.linkedin} onChange={update} placeholder="https://linkedin.com/in/ti" disabled={!isEditing} error={errors['links.linkedin']} /><Field label="Lidhja në GitHub" name="links.github" type="url" value={profile.links.github} onChange={update} placeholder="https://github.com/ti" disabled={!isEditing} error={errors['links.github']} /><Field label="Portofoli online" name="links.portfolio" type="url" value={profile.links.portfolio} onChange={update} placeholder="https://portofoli-yt.com" disabled={!isEditing} error={errors['links.portfolio']} /></div></SectionCard>

        <SectionCard id="documents" number="06" title="Dokumentet" description="Ngarko dokumente PDF. Madhësia maksimale: 10 MB."><div className="grid gap-3 md:grid-cols-2"><FileUpload label="CV / Jetëshkrimi" value={profile.documents.cv} onChange={(cv) => setProfile((current) => ({ ...current, documents: { ...current.documents, cv } }))} disabled={!isEditing} /><FileUpload label="Letër motivimi" value={profile.documents.coverLetter} onChange={(coverLetter) => setProfile((current) => ({ ...current, documents: { ...current.documents, coverLetter } }))} disabled={!isEditing} /><FileUpload label="Certifikatat" value={profile.documents.certificates} onChange={(certificates) => setProfile((current) => ({ ...current, documents: { ...current.documents, certificates } }))} disabled={!isEditing} /><FileUpload label="Transkripta akademike" value={profile.documents.transcript} onChange={(transcript) => setProfile((current) => ({ ...current, documents: { ...current.documents, transcript } }))} disabled={!isEditing} /></div></SectionCard>

        <SectionCard id="preferences" number="07" title="Preferencat për praktikë" description="Na ndihmo të të sugjerojmë mundësi që përputhen me synimet e tua."><div className="grid gap-4 sm:grid-cols-2"><Field label="Fusha e preferuar" name="preferences.field" value={profile.preferences.field} onChange={update} options={['Zhvillim softuerësh', 'Dizajn i produktit', 'Të dhëna dhe analiza', 'Marketing', 'Biznes', 'Tjetër']} disabled={!isEditing} /><Field label="Mënyra e preferuar e punës" name="preferences.workType" value={profile.preferences.workType} onChange={update} options={['Në zyrë', 'Në distancë', 'Hibrid']} disabled={!isEditing} /><Field label="Data e fillimit të disponueshmërisë" name="preferences.startDate" type="date" value={profile.preferences.startDate} onChange={update} disabled={!isEditing} /><Field label="Kohëzgjatja e preferuar" name="preferences.duration" value={profile.preferences.duration} onChange={update} options={['1–2 muaj', '3 muaj', '4–6 muaj', 'Mbi 6 muaj']} disabled={!isEditing} /></div></SectionCard>
      </form>
    </div>
  </StudentWorkspace>;
}
