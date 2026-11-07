export const STUDENT_KEY = 'internup:student-profile';
export const APPLICATIONS_KEY = 'internup:student-applications';

export const seedProfile = {
  firstName: 'Arta',
  lastName: 'Krasniqi',
  email: 'student@internup.test',
  phone: '+383 44 123 456',
  city: 'Prishtinë',
  country: 'Kosovë',
  university: 'Universiteti i Prishtinës',
  faculty: 'Fakulteti i Inxhinierisë Elektrike dhe Kompjuterike',
  major: 'Shkenca Kompjuterike',
  studyYear: 'Viti i tretë',
  graduationYear: '2027',
  gpa: '9.1',
  photo: '',
  technicalSkills: ['JavaScript', 'React', 'SQL', 'Figma'],
  softSkills: ['Komunikim', 'Punë në ekip', 'Zgjidhje problemesh'],
  languages: [
    { name: 'Shqip', level: 'Amtare' },
    { name: 'Anglisht', level: 'E avancuar' },
  ],
  links: {
    linkedin: 'https://linkedin.com/in/arta-krasniqi',
    github: 'https://github.com/arta-krasniqi',
    portfolio: 'https://arta.design',
  },
  documents: { cv: 'Arta_Krasniqi_CV.pdf', coverLetter: '', certificates: '', transcript: 'Transcript_2025.pdf' },
  preferences: { field: 'Zhvillim softuerësh', workType: 'Hibrid', startDate: '2026-06-01', duration: '3 muaj' },
};

export const recommendedInternships = [
  { id: 'frontend-developer', title: 'Praktikant/e në Zhvillimin Frontend', company: 'Kodra Labs', city: 'Prishtinë', type: 'Hybrid', duration: '3 muaj', paid: true, skills: ['React', 'JavaScript'], posted: 'Para 2 ditësh' },
  { id: 'product-design', title: 'Praktikant/e në Dizajn të Produktit', company: 'Vala Studio', city: 'Prishtinë', type: 'On-site', duration: '4 muaj', paid: true, skills: ['Figma', 'Prototyping'], posted: 'Para 4 ditësh' },
  { id: 'data-analyst', title: 'Praktikant/e në Analizë të të Dhënave', company: 'Datara', city: 'Prishtinë', type: 'Remote', duration: '6 muaj', paid: true, skills: ['SQL', 'Python'], posted: 'Para 1 jave' },
];

export const seedApplications = [
  { id: 'app-1001', position: 'Praktikant/e në Zhvillimin Frontend', company: 'Kodra Labs', date: '2026-10-29', status: 'Under Review', message: 'Jam e entuziazmuar të kontribuoj në ekipin tuaj të produktit dhe të zhvilloj aftësitë e mia në React.' },
  { id: 'app-1002', position: 'Praktikant/e në Dizajn të Produktit', company: 'Vala Studio', date: '2026-10-21', status: 'Shortlisted', message: 'Më pëlqen ta kthej hulumtimin e përdoruesve në përvoja të thjeshta dhe të menduara mirë.' },
  { id: 'app-1003', position: 'Praktikant/e në Analizë të të Dhënave', company: 'Datara', date: '2026-10-14', status: 'Pending', message: 'Do të doja të mësoja nga ekipi juaj i analizës së të dhënave.' },
];

export function readStudentProfile(user) {
  const key = `${STUDENT_KEY}:${user?.email ?? 'guest'}`;
  try {
    const stored = JSON.parse(window.localStorage.getItem(key) ?? 'null');
    const profile = user?.email === 'student@internup.test' ? seedProfile : {
      ...seedProfile,
      firstName: user?.profile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || '',
      lastName: user?.profile?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      university: user?.profile?.university || '',
      major: user?.profile?.studyProgram || '',
      studyYear: user?.profile?.studyYear || '',
      technicalSkills: [], softSkills: [], languages: [], links: { linkedin: '', github: '', portfolio: '' },
      documents: { cv: '', coverLetter: '', certificates: '', transcript: '' },
      preferences: { field: '', workType: '', startDate: '', duration: '' },
    };
    return { ...profile, ...(user?.profile ?? {}), ...(stored ?? {}) };
  } catch {
    return seedProfile;
  }
}

export function saveStudentProfile(user, profile) {
  const key = `${STUDENT_KEY}:${user?.email ?? 'guest'}`;
  window.localStorage.setItem(key, JSON.stringify(profile));
}

export function readApplications(user) {
  const key = `${APPLICATIONS_KEY}:${user?.email ?? 'guest'}`;
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) ?? 'null');
    return saved ?? (user?.email === 'student@internup.test' ? seedApplications : []);
  } catch {
    return user?.email === 'student@internup.test' ? seedApplications : [];
  }
}

export function saveApplications(user, applications) {
  const key = `${APPLICATIONS_KEY}:${user?.email ?? 'guest'}`;
  window.localStorage.setItem(key, JSON.stringify(applications));
}

export const applicationStatuses = ['Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'];
export const applicationStatusLabels = {
  Pending: 'Në pritje',
  'Under Review': 'Në shqyrtim',
  Shortlisted: 'Në listën e ngushtë',
  Accepted: 'Pranuar',
  Rejected: 'Refuzuar',
};

export const languageOptions = [
  'Afrikansisht', 'Akanisht', 'Alandisht', 'Amharisht', 'Arabisht', 'Aragonezisht', 'Armenisht', 'Asamezisht', 'Azerisht', 'Bambara', 'Baskisht', 'Bengalisht', 'Birmane', 'Bislama', 'Boshnjakisht', 'Bretonisht', 'Bullgarisht', 'Katalanisht', 'Cebuano', 'Kinezisht', 'Korsikisht', 'Kroatisht', 'Çekisht', 'Danisht', 'Divehi', 'Holandisht', 'Dzongkha', 'Anglisht', 'Esperanto', 'Estonisht', 'Ewe', 'Faroisht', 'Fixhianisht', 'Finlandisht', 'Frëngjisht', 'Frizisht', 'Galicianisht', 'Gjeorgjisht', 'Gjermanisht', 'Greqisht', 'Guarani', 'Guxharatisht', 'Haitianisht', 'Hausisht', 'Hebraisht', 'Hindisht', 'Hungarisht', 'Islandisht', 'Igbo', 'Indonezisht', 'Irlandisht', 'Italisht', 'Japonisht', 'Javaneze', 'Kazakisht', 'Kmerisht', 'Kikongo', 'Koreanisht', 'Kurdishte', 'Kirgizisht', 'Laosisht', 'Latinisht', 'Letonisht', 'Lingala', 'Lituanisht', 'Luksemburgisht', 'Maqedonisht', 'Malagasisht', 'Malajisht', 'Malayalam', 'Maltezisht', 'Maorisht', 'Maratisht', 'Mongolisht', 'Nepalisht', 'Norvegjisht', 'Odia', 'Oromisht', 'Pashto', 'Persisht', 'Polonisht', 'Portugalisht', 'Punjabisht', 'Rumanisht', 'Rusisht', 'Samoanisht', 'Sanskritisht', 'Serbisht', 'Shqip', 'Sinhaleze', 'Sllovakisht', 'Sllovenisht', 'Somalisht', 'Spanjisht', 'Suahilisht', 'Suedisht', 'Tagalog', 'Taxhikisht', 'Tamilisht', 'Tatarisht', 'Teluguisht', 'Thai', 'Tibetisht', 'Tigrinja', 'Turqisht', 'Turkmenisht', 'Ukrainisht', 'Urdu', 'Uzbekisht', 'Vietnamisht', 'Uellsisht', 'Jorubisht', 'Zulu',
].sort((a, b) => a.localeCompare(b, 'sq'));

export function getProfileSections(profile) {
  return [
    { id: 'personal', label: 'Të dhënat personale', complete: Boolean(profile.firstName && profile.lastName && profile.email && profile.phone && profile.city && profile.country) },
    { id: 'academic', label: 'Të dhënat akademike', complete: Boolean(profile.university && profile.faculty && profile.major && profile.studyYear && profile.graduationYear && profile.gpa) },
    { id: 'skills', label: 'Aftësitë dhe kualifikimet', complete: Boolean(profile.technicalSkills?.length && profile.softSkills?.length) },
    { id: 'languages', label: 'Gjuhët', complete: Boolean(profile.languages?.length) },
    { id: 'links', label: 'Lidhjet profesionale', complete: Boolean(profile.links?.linkedin && profile.links?.github && profile.links?.portfolio) },
    { id: 'documents', label: 'Dokumentet', complete: Boolean(profile.documents?.cv && profile.documents?.transcript) },
    { id: 'preferences', label: 'Preferencat për praktikë', complete: Boolean(profile.preferences?.field && profile.preferences?.workType && profile.preferences?.startDate && profile.preferences?.duration) },
  ];
}

export function getProfileCompletion(profile) {
  const sections = getProfileSections(profile);
  return Math.round((sections.filter((section) => section.complete).length / sections.length) * 100);
}
