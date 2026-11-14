import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import {
  universityTypeToDb,
  verificationStatusToDb,
  workModeToDb,
} from '../../src/adapters/outbound/prisma/mappers/enumMaps.js';
import { dayFromToday, daysAgo, indexBy, loadJson } from './helpers.js';

const prisma = new PrismaClient();

async function clear() {
  await prisma.internshipSkill.deleteMany();
  await prisma.story.deleteMany();
  await prisma.studentVerification.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.university.deleteMany();
  await prisma.company.deleteMany();
  await prisma.city.deleteMany();
}

async function seedCities() {
  await prisma.city.createMany({ data: loadJson('cities').map((name) => ({ name })) });
  return indexBy(await prisma.city.findMany(), 'name', 'qyteti');
}

async function seedCompanies(cityId) {
  await prisma.company.createMany({
    data: loadJson('companies').map(({ city, ...company }) => ({ ...company, cityId: cityId(city) })),
  });
  return indexBy(await prisma.company.findMany(), 'slug', 'kompania');
}

async function seedInternships(cityId, companyId) {
  const internships = loadJson('internships');

  const skillNames = [...new Set(internships.flatMap((internship) => internship.skills))];
  await prisma.skill.createMany({ data: skillNames.map((name) => ({ name })) });
  const skillId = indexBy(await prisma.skill.findMany(), 'name', 'aftësia');

  await prisma.internship.createMany({
    data: internships.map(({ skills, company, city, workMode, opensInDays, closesInDays, ...internship }) => ({
      ...internship,
      workMode: workModeToDb[workMode],
      opensAt: dayFromToday(opensInDays),
      closesAt: dayFromToday(closesInDays),
      companyId: companyId(company),
      cityId: cityId(city),
    })),
  });
  const internshipId = indexBy(await prisma.internship.findMany(), 'slug', 'praktika');

  await prisma.internshipSkill.createMany({
    data: internships.flatMap((internship) =>
      internship.skills.map((name, position) => ({
        internshipId: internshipId(internship.slug),
        skillId: skillId(name),
        position,
      })),
    ),
  });
}

async function seedUniversities(cityId) {
  await prisma.university.createMany({
    data: loadJson('universities').map(({ city, type, ...university }) => ({
      ...university,
      type: universityTypeToDb[type],
      cityId: cityId(city),
    })),
  });
  return indexBy(await prisma.university.findMany(), 'slug', 'universiteti');
}

async function seedStudentVerifications(universityId) {
  await prisma.studentVerification.createMany({
    data: loadJson('studentVerifications').map(
      ({ university, status, submittedDaysAgo, decidedDaysAgo, ...verification }) => ({
        ...verification,
        status: verificationStatusToDb[status],
        submittedAt: daysAgo(submittedDaysAgo),
        decidedAt: decidedDaysAgo === null ? null : daysAgo(decidedDaysAgo),
        universityId: universityId(university),
      }),
    ),
  });
}

async function seedStories(companyId, universityId) {
  await prisma.story.createMany({
    data: loadJson('stories').map(({ company, university, publishedDaysAgo, publishedHour, ...story }) => ({
      ...story,
      publishedAt: daysAgo(publishedDaysAgo, publishedHour),
      companyId: company ? companyId(company) : null,
      universityId: university ? universityId(university) : null,
    })),
  });
}

async function main() {
  await clear();

  const cityId = await seedCities();
  const companyId = await seedCompanies(cityId);
  await seedInternships(cityId, companyId);
  const universityId = await seedUniversities(cityId);
  await seedStudentVerifications(universityId);
  await seedStories(companyId, universityId);

  const [cities, companies, internships, skills, universities, verifications, stories] = await Promise.all([
    prisma.city.count(),
    prisma.company.count(),
    prisma.internship.count(),
    prisma.skill.count(),
    prisma.university.count(),
    prisma.studentVerification.count(),
    prisma.story.count(),
  ]);
  console.table({ cities, companies, internships, skills, universities, verifications, stories });
}

main()
  .catch((error) => {
    console.error('Seed dështoi:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
