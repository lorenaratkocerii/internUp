export function createCompany({
  id,
  name,
  shortDescription,
  description,
  history,
  foundedYear,
  location,
  website,
  industry,
  size,
  workMode,
  technologies = [],
  culture,
  benefits = [],
  coverImage,
  coverAlt,
  coverPosition = 'center',
  logo = '',
}) {
  if (!id || !name || !industry || !location) {
    throw new Error('Një kompani duhet të ketë id, emër, industri dhe lokacion.');
  }
  if (!Number.isInteger(foundedYear)) {
    throw new Error('Viti i themelimit duhet të jetë numër i plotë.');
  }

  return Object.freeze({
    id,
    name,
    shortDescription,
    description,
    history,
    foundedYear,
    location,
    website,
    industry,
    size,
    workMode,
    technologies: Object.freeze([...technologies]),
    culture,
    benefits: Object.freeze([...benefits]),
    coverImage,
    coverAlt,
    coverPosition,
    logo,
  });
}
