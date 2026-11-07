export const STUDENT_KEY = 'internup:student-profile';

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
  { id: 'backend-developer', title: 'Zhvillues/e Backend', company: 'Ura Systems', city: 'Prishtinë', type: 'Hybrid', duration: '6 muaj', paid: true, skills: ['Node.js', 'PostgreSQL'], posted: 'Para 2 ditësh' },
  { id: 'fullstack-intern', title: 'Praktikant/e për zhvillim Full-Stack', company: 'Dija Soft', city: 'Mitrovicë', type: 'Hybrid', duration: '4 muaj', paid: true, skills: ['Vue.js', 'MySQL'], posted: 'Para 4 ditësh' },
  { id: 'product-analyst', title: 'Analist/e i/e produktit', company: 'Dardan Pay', city: 'Prishtinë', type: 'Hybrid', duration: '5 muaj', paid: true, skills: ['SQL', 'Excel'], posted: 'Para 1 jave' },
];

export function applicantDetails(profile) {
  return {
    name: [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Student/e',
    university: profile.university ?? '',
    major: profile.major ?? '',
    city: profile.city ?? '',
    skills: profile.technicalSkills ?? [],
  };
}

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
